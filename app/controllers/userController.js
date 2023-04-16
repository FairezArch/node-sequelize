const { Op, Sequelize } = require('sequelize')
const db = require("../models");
const User = db.User;
const Book = db.Book;
const bcrypt = require('bcrypt')

const index = async (req, res) => {
    try {
        const lists = await User.findAll({
            include: [{ model: Book }], order: [
                [Sequelize.col('id'), 'ASC'],
                [Sequelize.col('Books.id'), 'ASC']
            ]
        })
        res.status(200).json({
            'status': true,
            'message': 'success',
            'data': lists
        })
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message,
        })
    }
}

const store = async (req, res) => {
    const { username, email, password } = req.body

    if (!email || !password || !username) return res.status(422).json({
        'message': "email, username and password are required"
    })

    try {

        const checkUsername = await User.findOne({ where: { username: { [Op.eq]: username } } })
        if (checkUsername) return res.status(422).json({
            'message': "Failed! username is already in use!"
        })

        const checkEmail = await User.findOne({ where: { email: { [Op.eq]: email } } })
        if (checkEmail) return res.status(422).json({
            'message': "Failed! Email is already in use!"
        })

        const hasPass = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hasPass
        })

        res.status(201).json({
            'status': true,
            'message': 'success',
            'data': []
        })
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message,
        })
    }
}

const show = async (req, res) => {
    const { id } = req.params

    try {
        const lists = await User.findOne({ where: { id: { [Op.eq]: id } } })
        res.status(200).json({
            'status': true,
            'message': 'success',
            'data': lists
        })
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message,
        })
    }
}

const update = async (req, res) => {
    const { id } = req.params
    const { username, email, password } = req.body

    if (!id) return res.status(404).json({
        'message': "Not Found!"
    })

    if (!email || !username) return res.status(422).json({
        'message': "email, username are required"
    })

    try {
        const user = await User.findOne({ where: { id: { [Op.eq]: id } } })

        if (user.username !== username) {
            const checkUsername = await User.findOne({ where: { username: { [Op.eq]: username } } })
            if (checkUsername) return res.status(422).json({
                'message': "Failed! username is already in use!"
            })
        }

        if (user.email !== email) {
            const checkEmail = await User.findOne({ where: { email: { [Op.eq]: email } } })
            if (checkEmail) return res.status(422).json({
                'message': "Failed! Email is already in use!"
            })
        }

        if (!user) return res.status(404).json({
            'message': "Not Found!"
        })

        const hasPass = await bcrypt.hash(password, 10)

        user.username = username
        user.email = email
        user.password = !password ? user.password : hasPass

        await user.save()

        res.status(200).json({
            'status': true,
            'message': 'success',
            'data': []
        })
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message,
        })
    }
}

const destroy = async (req, res) => {
    const { id } = req.params

    if (!id) return res.status(404).json({
        'message': "Not Found!"
    })

    try {
        await User.destroy({ where: { id: { [Op.eq]: id } } })
        res.status(204).json()
    } catch (error) {
        res.status(500).json({
            'status': false,
            'message': error.message,
        })
    }
}


module.exports = { index, store, show, update, destroy }