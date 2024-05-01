const Task = require("../models/taskModel.js");
const User = require("../models/userModel.js");

//for Admin
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const createTask = async (req, res, next) => {
  const { email, title, description, priority } = req.body.task;

  if (!email || !title || !description) {
    return res.status(400).send({ error: "Missing fields" });
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).send({ error: "User not found!" });
    }

    const taskData = {
      assignedTo: foundUser._id,
      userName: foundUser.name,
      userEmail: foundUser.email,
      title,
      description,
      status: "todo",
      priority,
    };

    const newTask = await Task.create(taskData);
    console.log(`New Task created for ${foundUser.name}`);
    return res.status(201).json({ success: true, newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const getSingleTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleTask = await Task.findById(id);
    if (!singleTask) {
      return res.status(404).send({ error: "No task with that ID was found." });
    }
    return res.status(200).json(singleTask);
  } catch (err) {
    console.error("Error getting task by ID: ", err);
    return res.status(500).send({ error: "Server Error" });
  }
};

const updateTask = async (req, res, next) => {
  let updatedField = {};
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  if (title) updatedField.title = title;
  if (description) updatedField.description = description;
  if (status) updatedField.status = status;
  if (priority) updatedField.priority = priority;

  try {
    const taskId = await Task.findById(id);
    if (!taskId) {
      return res.status(404).send({ error: "No such Task!." });
    }
    const result = await Task.findByIdAndUpdate(
      { _id: id },
      { $set: updatedField },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: "Updated Successfully", data: result });
  } catch (err) {
    console.log("Error updating task:", err);
    return res.status(500).send({ error: "Server Error" });
  }
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id });
    if (!deletedTask) {
      return res.status(404).send({ error: "No Such Task!" });
    } else {
      return res.status(200).send({ message: "Deletion Successful" });
    }
  } catch (error) {
    console.log("Error deleting the task: ", error);
    return res.status(500).send({ error: "Server Error" });
  }
};

//For User
const getAllTasksByUserId = async (req, res, next) => {
  try {
    const userId = req.userData.id;
    const tasks = await Task.find({ assignedTo: userId });
    return res.status(200).json({ success: "Your All  Tasks.", data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    next(error);
  }
};

const getSingleTasksByUserId = async (req, res, next) => {
  try {
    const userId = req.userData.id;
    const taskId = req.params.taskId;

    const foundTask = await Task.findById({ _id: taskId, assignedTo: userId });
    if (!foundTask) {
      return res.status(401).json({ error: "Not Authorized!" });
    }
    return res.status(200).json(foundTask);
  } catch (error) {
    console.error("Error getting single task:", error);
    next(error);
  }
};

const updateTaskForUser = async (req, res, next) => {
  let updatedField = {};

  const { status } = req.body;

  if (status) updatedField.status = status;

  const taskId = req.params.taskId;
  const userId = req.userData.id;

  try {
    const foundTask = await Task.findByIdAndUpdate(
      { _id: taskId, assignedTo: userId },
      { $set: updatedField },
      { new: true }
    );
    if (!foundTask) {
      return res.status(404).json({ error: "No such task exists." });
    }
    return res
      .status(200)
      .json({ success: "Updated Successfully", data: foundTask });
  } catch (error) {
    console.error("Error updating task: ", error);
    next(error);
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
  getAllTasksByUserId,
  getSingleTasksByUserId,
  updateTaskForUser,
};
