const jobLeaveController = require('../controllers/jobLeaveController')

const router = require('express').Router();

// ADD Employee
router.get('/', jobLeaveController.getAllJobLeave)
router.get('/:id', jobLeaveController.getJobLeaveById)
router.put('/:id', jobLeaveController.updateJobLeaveById)


module.exports = router;