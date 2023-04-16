// import module/package
const express = require("express")
const app = express()
const morgan = require("morgan")
const errorHandler = require('./app/middleware/errorHandler')
const errorPath = require('./app/middleware/errorPath')
const accessLogStream  = require('./app/middleware/createLog')
const verifyJWT = require('./app/middleware/verifyJWT')
const { morganStatus } = require('./config/app')
const cookies = require('cookie-parser')
const cors = require('cors')

//cors
const corsOption = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200
}
app.use(cors(corsOption))

// setting middleware
// Logger
app.use(morgan(morganStatus, { stream: accessLogStream }));

// Build-in middleware to handle urlencoded data
// in other words, form-data:
// Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Build-in middleware for json
app.use(express.json());

// use cookie
app.use(cookies())

// Route
// API
const api = `/api/v1`
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')

//Auth
app.use(`${api}/auth`, authRoute)

// Route bellow will need jwt token
app.use(verifyJWT)

// Route - User
app.use(`${api}/user`, userRoute)

// setting error path
app.use('*', errorPath);

// setting another error program
app.use(errorHandler)

// export app
module.exports = app;