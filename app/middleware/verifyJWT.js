const jwt = require("jsonwebtoken");
const { tokenSecret } = require('../../config/auth')


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).send({ message: "Unauthorized!" })
    const token = authHeader.split(" ")[1];
    jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" }); //Invalid Token
        req.user = decoded.user.username;
        next();
    });
};

module.exports = verifyJWT