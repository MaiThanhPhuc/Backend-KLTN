const jwt = require("jsonwebtoken");

const EmployeeRole = {
  ADMIN: 0,
  HUMAN_RESOURCE: 1,
  MANAGER: 2,
  LEADER: 3,
  MEMBER: 4,
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
    if (req.user && (req.user.id === req.params.id || req.user.role == EmployeeRole.ADMIN || req.user.role == EmployeeRole.HUMAN_RESOURCE)) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == EmployeeRole.ADMIN || req.user.role == EmployeeRole.HUMAN_RESOURCE) {
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