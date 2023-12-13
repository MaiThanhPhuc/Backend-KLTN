const employeeController = require('../controllers/employeeController')
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require('express').Router();

// ADD Employee
router.get('/getAbsentByDate', verifyToken, employeeController.getAbsentByDate)
router.get('/getAll', verifyToken, employeeController.getAllEmployee)
router.get('/:id', verifyToken, employeeController.getEmployeeById)
router.post('/', verifyTokenAndAdmin, employeeController.addEmployee)
router.post('/importData', verifyTokenAndAdmin, employeeController.saveImportEmployee)
router.get('/', verifyToken, employeeController.searchEmployee)
router.get('/getSalaryByMonth/:id', verifyTokenAndAdmin, employeeController.getSalaryByMonth)
router.put('/:id', verifyTokenAndUserAuthorization, employeeController.updateEmployeeById)
router.put('/resetPassword/:id', verifyTokenAndUserAuthorization, employeeController.resetPassword)
router.delete('/:id', verifyTokenAndAdmin, employeeController.deleteEmployeeById)

module.exports = router;
