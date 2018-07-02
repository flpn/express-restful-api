const express = require('express')

const checkAuth = require('../middlewares/check-auth')
const UserController = require('../controllers/user')

const router = express.Router()

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.delete('/:userId', checkAuth, UserController.delete_user)

module.exports = router
