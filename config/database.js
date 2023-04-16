const { dbConnect, dbHost, dbName, dbUser, dbPassword } = require('./app')

module.exports = {
  "development": {
    "username": dbUser,
    "password": dbPassword,
    "database": dbName,
    "host": dbHost,
    "dialect": dbConnect,
  },
  "test": {
    "username": dbUser,
    "password": dbPassword,
    "database": dbName,
    "host": dbHost,
    "dialect": dbConnect
  },
  "production": {
    "username": dbUser,
    "password": dbPassword,
    "database": dbName,
    "host": dbHost,
    "dialect": dbConnect,
    "logging": false
  }
}
