const authControler = require('../controllers/authController')

const router = require('express').Router();

// ADD Employee
router.post('/', authControler.login)

module.exports = router;