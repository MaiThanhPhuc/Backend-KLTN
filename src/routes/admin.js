const adminController = require('../controllers/adminController')

const router = require('express').Router();
// team
router.get('/getAllTeam', adminController.getAllTeam)
router.get('/getTeamById/:id', adminController.getTeamById)
router.post('/addTeam', adminController.addTeam)
router.put('/updateTeamById/:id', adminController.updateTeamById)
router.get('/searchTeam', adminController.searchTeam)

// department
router.get('/getDepartmentById/:id', adminController.getDepartmentById)
router.get('/getAllDepartment', adminController.getAllDepartment)
router.put('/updateDepartmentById/:id', adminController.updateDepartmentById)
router.post('/addDepartment', adminController.addDepartment)
router.get('/searchDepartment', adminController.searchDepartment)

//office
router.get('/getAllOffice', adminController.getAllOffice)
router.post('/addOffice', adminController.addOffice)
router.get('/getOfficeById/:id', adminController.getOfficeById)
router.put('/updateOfficeById/:id', adminController.updateOfficeById)
router.get('/searchOffice', adminController.searchOffice)

module.exports = router;