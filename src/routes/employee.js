const employeeController = require('../controllers/employeeController')
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ADD Employee
router.get('/getAbsentByDate', verifyToken, employeeController.getAbsentByDate)
router.get('/getAll', verifyToken, employeeController.getAllEmployee)
router.post('/', verifyTokenAndAdmin, employeeController.addEmployee)
router.post('/importData', verifyTokenAndAdmin, employeeController.saveImportEmployee)
router.get('/', verifyToken, employeeController.searchEmployee)
router.get('/getEmployeeSalary', verifyToken, employeeController.getEmployeeSalary)
router.post('/sendEmailPayslip/:id', verifyToken, upload.single('pdfFile'), employeeController.sendEmailPayslip)
router.post('/calcSalaryEmployeeByMonth', verifyTokenAndAdmin, employeeController.calcSalaryEmployeeByMonth)
router.put('/resetPassword/:id', verifyTokenAndUserAuthorization, employeeController.resetPassword)
router.put('/:id', verifyTokenAndUserAuthorization, employeeController.updateEmployeeById)
router.get('/:id', verifyToken, employeeController.getEmployeeById)
router.delete('/:id', verifyTokenAndAdmin, employeeController.deleteEmployeeById)

module.exports = router;
