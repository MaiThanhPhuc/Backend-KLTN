const adminController = require('../controllers/adminController')
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require('express').Router();
// team
router.get('/getAllTeam', verifyToken, adminController.getAllTeam)
router.get('/getTeamById/:id', verifyTokenAndAdmin, adminController.getTeamById)
router.post('/addTeam', verifyTokenAndAdmin, adminController.addTeam)
router.put('/updateTeamById/:id', verifyTokenAndAdmin, adminController.updateTeamById)
router.get('/searchTeam', adminController.searchTeam)

// department
router.get('/getDepartmentById/:id', verifyTokenAndAdmin, adminController.getDepartmentById)
router.get('/getAllDepartment', verifyToken, adminController.getAllDepartment)
router.put('/updateDepartmentById/:id', verifyTokenAndAdmin, adminController.updateDepartmentById)
router.post('/addDepartment', verifyTokenAndAdmin, adminController.addDepartment)
router.get('/searchDepartment', verifyToken, adminController.searchDepartment)

//office
router.get('/getAllOffice', verifyToken, adminController.getAllOffice)
router.post('/addOffice', verifyTokenAndAdmin, adminController.addOffice)
router.get('/getOfficeById/:id', verifyTokenAndAdmin, adminController.getOfficeById)
router.put('/updateOfficeById/:id', verifyTokenAndAdmin, adminController.updateOfficeById)
router.get('/searchOffice', verifyToken, adminController.searchOffice)

module.exports = router;