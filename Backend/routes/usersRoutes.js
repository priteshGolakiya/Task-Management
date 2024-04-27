// usersRoutes
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  // createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  signup,
  login,
  logout,
  // deleteUser,
} = require("../controllers/UserController.js");
const authMiddleWare = require("../middleware/authMiddleWare.js");
const authenticateUser = require("../middleware/authenticateUser.js");

const asyncHandler = require("express-async-handler");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Internal Server Error" });
};

// router.post("/", asyncHandler(createUser));
router.get("/:id", asyncHandler(getSingleUser));
router.put("/:id", asyncHandler(updateUser));
// router.delete("/:id", asyncHandler(deleteUser));

router.get("/", asyncHandler(getAllUsers));
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authMiddleWare, logout);
router.delete("/:id", authMiddleWare, authenticateUser, deleteUser);

router.use(errorHandler);

module.exports = router;
