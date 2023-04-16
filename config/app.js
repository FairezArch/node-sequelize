require('dotenv').config()

module.exports = {
    secureHTTP: process.env.MUST_SECURE,
    refreshJwt: process.env.REFRESH_JWT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    morganStatus: process.env.MORGAN_STATUS,
    dbConnect: process.env.DB_CONNECTION,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
}