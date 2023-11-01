const { Employee } = require("../models/employee")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
let refreshTokens = [];

const authController = {

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "1d" }
    );
  },

  loginUser: async (req, res) => {
    try {
      const user = await Employee.findOne({ email: req.body.email });
      if (!user) {
        res.status(404).json("Email not exist!");
      }
      else {
        const validPassword = req.body.password === user.password;

        if (!validPassword) {
          res.status(404).json("Incorrect password");
        }
        if (user && validPassword) {
          //Generate access token
          const accessToken = authController.generateAccessToken(user);
          //Generate refresh token
          const refreshToken = authController.generateRefreshToken(user);
          refreshTokens.push(refreshToken);
          //STORE REFRESH TOKEN IN COOKIE
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          const { password, isAdmin, ...others } = user._doc;
          res.status(200).json({ ...others, accessToken, refreshToken });
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
}

module.exports = authController;