const express = require('express')

// controller functions
const { addPassword, getPassword } = require('../controllers/userController')

const router = express.Router()

router.post('/', addPassword)

router.get('/', getPassword)

module.exports = router