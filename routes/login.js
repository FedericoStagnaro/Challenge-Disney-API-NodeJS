const router = require('express').Router()
const loginController = require('../controllers/login')

/**
 *  LOGIN with credentials
 */
router.post('/', loginController.login)

module.exports = router