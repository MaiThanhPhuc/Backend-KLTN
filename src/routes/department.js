const departmentController = require('../controllers/departmentController')

const router = require('express').Router();

// ADD Employee
router.get('/', departmentController.getAllDepartment)
router.get('/:id', departmentController.getDepartmentById)
router.post('/', departmentController.addDepartment)
router.put('/:id', departmentController.updateDepartmentById)
router.delete('/:id', departmentController.deleteDepartmentById)


module.exports = router;