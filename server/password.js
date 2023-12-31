const express = require('express')

// controller functions
const { addPassword, getPassword } = require('./passwordController')

const router = express.Router()

router.post('/', addPassword)

router.get('/:tokenId/:password/', getPassword)

module.exports = router