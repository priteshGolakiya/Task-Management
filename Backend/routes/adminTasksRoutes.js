const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController.js");
const asyncHandler = require("express-async-handler");
const authenticateUser = require("../middleware/authenticateUser.js");
const authMiddleWare = require("../middleware/authMiddleWare.js");

// Admin Routes
router.get("/", authenticateUser, authMiddleWare, asyncHandler(getAllTasks));
router.post("/", authenticateUser, authMiddleWare, asyncHandler(createTask));
router.get(
  "/:id",
  authenticateUser,
  authMiddleWare,
  asyncHandler(getSingleTask)
);
router.put("/:id", authenticateUser, authMiddleWare, asyncHandler(updateTask));
router.delete(
  "/:id",
  authenticateUser,
  authMiddleWare,
  asyncHandler(deleteTask)
);

module.exports = router;
