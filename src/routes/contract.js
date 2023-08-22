const contractController = require('../controllers/contractController')

const router = require('express').Router();

// ADD Employee
router.post('/', contractController.addContract)
router.get('/', contractController.getAllContract)
router.post('/:id', contractController.getContractById)
router.post('/:id', contractController.updateContractById)


module.exports = router;