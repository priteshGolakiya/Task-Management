const express = require("express");
const router = express.Router();
const {
  getAllTasksByUserId,
  getSingleTasksByUserId,
  updateTaskForUser,
} = require("../controllers/TaskController.js");
const asyncHandler = require("express-async-handler");
const authMiddleWare = require("../middleware/authMiddleWare.js");

// User Routes
router.get("/users/", authMiddleWare, asyncHandler(getAllTasksByUserId));
router.get(
  "/users/:taskId",
  authMiddleWare,
  asyncHandler(getSingleTasksByUserId)
);
router.put("/users/:taskId", authMiddleWare, asyncHandler(updateTaskForUser));

module.exports = router;
