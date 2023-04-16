const { jwtSecret, refreshJwt } = require('./app')
module.exports = {
    tokenSecret: jwtSecret,
    refreshSecret: refreshJwt
}