const jwt = require("jsonwebtoken");

const EmployeeRole = {
  ADMIN: 0,
  MANAGER: 1,
  LEADER: 2,
  MEMBER: 3,
}

const verifyToken = (req, res, next) => {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  try {
    const token = req.headers.authorization;
    // const refreshToken = req.cookie.refreshToken;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid!");
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  } catch (error) {
    res.status(500).json(error);
  }

};

const verifyTokenAndUserAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin || req.user.role == EmployeeRole.ADMIN) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
};