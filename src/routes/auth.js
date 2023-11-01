const authController = require('../controllers/authController')
const { verifyToken } = require("../middlewares/verifyToken");
const router = require('express').Router();

// ADD Employee
//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOG OUT
router.post("/logout", verifyToken, authController.logOut);

module.exports = router;