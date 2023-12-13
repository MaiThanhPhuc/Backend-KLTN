const workLogController = require('../controllers/workLogController')
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../middlewares/verifyToken");
const router = require('express').Router();
// team
router.get('/getAllWorkLog', verifyToken, workLogController.getAllWorkLog)
router.get('/getWorkLogByMonth', verifyToken, workLogController.getWorkLogByMonth)
router.get('/getWorkLogById/:id', verifyTokenAndAdmin, workLogController.getWorkLogById)
router.post('/addWorkLog', verifyTokenAndUserAuthorization, workLogController.addWorkLog)
router.put('/updateWorkLogById/:id', verifyTokenAndAdmin, workLogController.updateWorkLogById)
router.get('/searchWorkLog', verifyToken, workLogController.searchWorkLog)

module.exports = router;