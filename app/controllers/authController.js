const db = require("../models");
const User = db.User;
const Book = db.Book

const Op = db.Sequelize.Op;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

const { tokenSecret, refreshSecret, secureHTTP } = require('../../config/auth')

const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!email || !password || !username) return res.status(422).json({
        'message': "email, username and password are required"
    })

    // Check duplicate username
    const duplicateUsername = await User.findOne({ where: { username: { [Op.eq]: username } } })
    if (duplicateUsername) return res.status(400).json({
        'message': "Username already exits"
    })

    // Check duplicate email
    const duplicate = await User.findOne({ where: { email: { [Op.eq]: email } } })
    if (duplicate) return res.status(400).json({
        'message': "Email already exits"
    })

    try {
        // encrypt password
        const encryptPass = await bcrypt.hash(password, 10)

        //store new user
        await User.create({ username, email, password: encryptPass })

        res.status(200).json({
            'status': true,
            'message': `New user has been created`,
            'data': []
        })
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message
        })
    }
}

const login = async (req, res) => {
    const cookies = req.cookies;
    const { email, password } = req.body

    if (!email || !password) return res.status(422).json({
        'message': "Email and password are required"
    })

    try {
        const findUser = await User.findOne({
            attributes: ['id', 'email', 'password', 'refresh_token'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        })
        if (!findUser) return res.status(401).send({ message: "Unauthorized!" }) //unAuth

        const match = await bcrypt.compare(password, findUser.password)
        if (match) {
            //create jwt
            const accessToken = jwt.sign(
                {
                    "user": { "username": findUser.username }
                },
                tokenSecret,
                { expiresIn: '30s' }
            )

            const refreshToken = jwt.sign(
                { "username": findUser.username },
                refreshSecret,
                { expiresIn: '1d' }
            );

            if (cookies?.jwt) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: secureHTTP == "true" ? true : false })
            }

            findUser.refreshToken = refreshToken
            await findUser.save()

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: secureHTTP == "true" ? true : false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            const lists = await User.findOne({
                include: Book,
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            })

            res.status(200).send({
                'status': true,
                'message': 'success',
                'data': lists,
                'authType': 'Bearer',
                accessToken
            });

        } else {
            res.status(401).send({ message: "Unauthorized!" })
        }
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message
        })
    }
}

const logout = async (req, res) => {
    // on client also delete the accesstoken
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)

    const tokenCookie = cookies.jwt
    const findUser = await User.findOne({ where: { refreshToken: { [Op.eq]: tokenCookie } } })

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: secureHTTP == "true" ? true : false })
        return res.sendStatus(204)
    }

    findUser.refreshToken = null
    await findUser.save()

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: secureHTTP == "true" ? true : false })
    res.sendStatus(204)
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)

    const tokenCookie = cookies.jwt
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: secureHTTP == "true" ? true : false })

    const findUser = await User.findOne({ where: { refreshToken: { [Op.eq]: tokenCookie } } })
    if (!findUser) {
        jwt.verify(
            tokenCookie,
            refreshSecret,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                const hackedUser = await User.findOne({ where: { username: { [Op.eq]: decoded.username } } })
                hackedUser.refreshToken = null;
                await hackedUser.save();
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    //evaluate jwt
    jwt.verify(tokenCookie, refreshSecret, async (err, decoded) => {
        if (err) {
            findUser.refreshToken = null
            await findUser.save();
        }
        if (err || findUser.username !== decoded.username) return res.sendStatus(403); //Invalid Token

        const accessToken = jwt.sign(
            {
                "user": { "username": findUser.username, }
            },
            tokenSecret,
            { expiresIn: '30s' }
        )

        const newRefreshToken = jwt.sign(
            {
                "user": { "username": findUser.username, }
            },
            refreshSecret,
            { expiresIn: '1d' }
        );

        findUser.refreshToken = newRefreshToken
        await findUser.save()

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: secureHTTP == "true" ? true : false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken })
    });
}

module.exports = { register, login, logout, handleRefreshToken }

