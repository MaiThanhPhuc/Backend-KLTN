const leaveTypeController = require('../controllers/leaveTypeController');

const router = require('express').Router();

// ADD LeaveType
router.get('/getAllLeaveType', leaveTypeController.getAllLeaveType)
router.get('/:id', leaveTypeController.getLeaveTypeById)
router.post('/', leaveTypeController.addLeaveType)
router.post('/addEmployeeLeaveType', leaveTypeController.addEmployeeLeaveType)
router.get('/', leaveTypeController.searchLeaveType)
router.put('/:id', leaveTypeController.updateLeaveTypeById)
router.delete('/:id', leaveTypeController.deleteLeaveTypeById)

module.exports = router;