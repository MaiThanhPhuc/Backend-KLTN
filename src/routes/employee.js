const employeeController = require('../controllers/employeeController')
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require('express').Router();

// ADD Employee
router.get('/getAll', verifyToken, employeeController.getAllEmployee)
router.get('/:id', verifyTokenAndUserAuthorization, employeeController.getEmployeeById)
router.post('/', verifyTokenAndAdmin, employeeController.addEmployee)
router.get('/', verifyToken, employeeController.searchEmployee)
router.put('/:id', verifyTokenAndUserAuthorization, employeeController.updateEmployeeById)
router.delete('/:id', verifyTokenAndAdmin, employeeController.deleteEmployeeById)

module.exports = router;
