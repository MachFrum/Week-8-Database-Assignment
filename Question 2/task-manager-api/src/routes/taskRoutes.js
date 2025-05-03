const express = require("express");
const taskController = require("../controllers/taskController");
const router = express.Router();

// GET all tasks (with optional filtering by status, user_id, category_id)
router.get("/", taskController.getAllTasks);

// GET task by ID
router.get("/:id", taskController.getTaskById);

// POST create a new task
router.post("/", taskController.createTask);

// PUT update a task by ID
router.put("/:id", taskController.updateTask);

// DELETE a task by ID
router.delete("/:id", taskController.deleteTask);

module.exports = router;

