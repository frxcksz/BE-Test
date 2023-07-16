const jwt = require('jsonwebtoken');
const config = require('../config/auth');

const db = require("../models");
// const model = db.model;

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: "Unauthorized",
    });
  }

  jwt.verify(token, config.secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: "Forbidden",
      });
    }

    req.user = user;
    next();
  });
};

const checkUserRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role || user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: "Forbidden",
      });
    }

    next();
  };
};

const verify = {
  authenticateJWT: authenticateJWT,
  checkUserRole: checkUserRole
};

module.exports = verify;
