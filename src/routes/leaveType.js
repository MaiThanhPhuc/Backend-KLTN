const leaveTypeController = require('../controllers/leaveTypeController');
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require('express').Router();

// ADD LeaveType
router.get('/getAllLeaveType', verifyToken, leaveTypeController.getAllLeaveType)
router.get('/getLeaveRequest', verifyToken, leaveTypeController.getLeaveRequest)
router.get('/getLeaveRequestByApprove', verifyToken, leaveTypeController.getLeaveRequestByApprove)
router.get('/getLeaveRequestHistory', verifyToken, leaveTypeController.getLeaveRequestHistory)
router.get('/:id', verifyToken, leaveTypeController.getLeaveTypeById)
router.get('/getLeaveRequestById/:id', verifyToken, leaveTypeController.getLeaveRequestById)
router.post('/', verifyTokenAndAdmin, leaveTypeController.addLeaveType)
router.post('/addEmployeeLeaveType', verifyTokenAndUserAuthorization, leaveTypeController.addEmployeeLeaveType)
router.post('/createLeaveRequest', verifyToken, leaveTypeController.createLeaveRequest)
router.post('/updateEmployeeLeaveType', verifyTokenAndUserAuthorization, leaveTypeController.updateEmployeeLeaveTypeById)
router.get('/', verifyToken, leaveTypeController.searchLeaveType)
// router.get('/getAbsent', verifyToken, leaveTypeController.getAbsentByDate)
router.put('/:id', verifyTokenAndUserAuthorization, leaveTypeController.updateLeaveTypeById)
router.delete('/:id', verifyTokenAndUserAuthorization, leaveTypeController.deleteLeaveTypeById)

module.exports = router;