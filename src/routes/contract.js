const contractController = require('../controllers/contractController')

const router = require('express').Router();

// ADD Employee
router.post('/', contractController.addContract)


module.exports = router;