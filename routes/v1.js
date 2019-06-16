const express = require('express')
const router = express.Router()

const User = require('../controllers/user')
const Donation = require('../controllers/donation')

router.get('/api/users', User.getAll)
router.post('/api/users', User.create)
router.post('/api/auth', User.auth)

router.get('/api/donations', Donation.getAll)
router.post('/api/donations', Donation.create)

module.exports = router
