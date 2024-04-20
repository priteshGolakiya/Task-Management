const CustomError = require("../services/customError");
const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
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

    req.userData = decode;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authMiddleWare;
