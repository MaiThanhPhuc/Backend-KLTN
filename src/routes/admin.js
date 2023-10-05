const adminController = require('../controllers/adminController')

const router = require('express').Router();

// ADD Employee
router.post('/', adminController.addTeam)


module.exports = router;