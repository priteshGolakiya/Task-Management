// authenticateUser.js
const CustomError = require("../services/customError");
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Unauthorized: Token missing or invalid", 401);
    }

    const token = authHeader.split(" ")[1];
    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new CustomError("Unauthorized: Invalid token", 401);
    }

    // Allow access to specific routes for users with the "user" role
    if (decode.role === "user" && req.baseUrl.startsWith("/tasks/users")) {
      req.userData = decode;
      return next();
    }

    // For other routes or non-"user" roles, perform admin check
    if (decode.role !== "admin") {
      throw new CustomError("Forbidden: You are not authorized", 403);
    }

    req.userData = decode;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticateUser;
