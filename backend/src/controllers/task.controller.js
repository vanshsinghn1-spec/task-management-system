const taskService = require("../services/task.service");

/**
 * Controller handling task HTTP requests
 */
const taskController = {
  /**
   * GET /api/tasks
   * Retrieve tasks with query filtering, sorting, and pagination
   */
  async getAllTasks(req, res, next) {
    try {
      const data = await taskService.getAllTasks(req.query);
      res.status(200).json({
        success: true,
        data: data.tasks,
        pagination: data.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/tasks/:id
   * Retrieve single task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/tasks
   * Create a new task
   */
  async createTask(req, res, next) {
    try {
      const newTask = await taskService.createTask(req.body);
      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/tasks/:id
   * Update an existing task
   */
  async updateTask(req, res, next) {
    try {
      const updatedTask = await taskService.updateTask(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/tasks/:id
   * Delete a task by ID
   */
  async deleteTask(req, res, next) {
    try {
      const deletedTask = await taskService.deleteTask(req.params.id);
      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/tasks/stats/summary
   * Retrieve task distribution statistics
   */
  async getTaskStats(req, res, next) {
    try {
      const stats = await taskService.getTaskStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = taskController;
