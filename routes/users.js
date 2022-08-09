const router = require('express').Router()
const userController = require('../controllers/users')


/**
 * CREATE user
 */
router.post('/', userController.createUser )

module.exports = router