const express = require('express')
const router = express.Router()

const authController = require('../app/controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/logout', authController.logout)

router.post('/refresh-token', authController.handleRefreshToken)

module.exports = router