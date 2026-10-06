const express = require("express");
const taskController = require("../controllers/task.controller");
const { validate, createTaskSchema, updateTaskSchema } = require("../middleware/validate");

const router = express.Router();

/**
 * Task routes
 */
router.get("/stats/summary", taskController.getTaskStats);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", validate(createTaskSchema), taskController.createTask);
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
