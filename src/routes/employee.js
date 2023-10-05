const employeeController = require('../controllers/employeeController')

const router = require('express').Router();

// ADD Employee
router.get('/', employeeController.getAllEmployee)
router.get('/:id', employeeController.getEmployeeById)
router.post('/', employeeController.addEmployee)
router.put('/:id', employeeController.updateEmployeeById)
router.delete('/:id', employeeController.deleteEmployeeById)


module.exports = router;
