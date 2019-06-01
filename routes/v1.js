const express = require('express')
const router = express.Router()

const User = require('../controllers/user')

router.get('/api/users', User.getAll)
router.post('/api/users', User.create)

module.exports = router
