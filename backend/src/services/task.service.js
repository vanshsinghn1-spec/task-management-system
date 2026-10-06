const { v4: uuidv4 } = require("uuid");
const { seedTasks } = require("../data/seedTasks");
const { AppError } = require("../middleware/errorHandler");

class TaskService {
  constructor() {
    // In-memory data store as required by assignment
    this.tasks = [...seedTasks];
  }

  /**
   * Get all tasks with support for search, filtering, sorting, and pagination
   */
  async getAllTasks(query = {}) {
    let result = [...this.tasks];

    const {
      search,
      status,
      priority,
      sortBy = "createdAt",
      sortOrder = "desc",
      page,
      limit
    } = query;

    // Filter by search term (case-insensitive across title & description)
    if (search && search.trim() !== "") {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (status && status !== "all") {
      result = result.filter((task) => task.status === status);
    }

    // Filter by priority
    if (priority && priority !== "all") {
      result = result.filter((task) => task.priority === priority);
    }

    // Sort
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "priority") {
        comparison = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
      } else if (sortBy === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else {
        // default createdAt
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const totalCount = result.length;

    // Pagination (if specified)
    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedTasks = result.slice(startIndex, startIndex + limitNum);

      return {
        tasks: paginatedTasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages: Math.ceil(totalCount / limitNum) || 1,
          hasNextPage: startIndex + limitNum < totalCount,
          hasPrevPage: pageNum > 1
        }
      };
    }

    return {
      tasks: result,
      pagination: {
        page: 1,
        limit: totalCount,
        totalCount,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }

  /**
   * Get single task by ID
   */
  async getTaskById(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new AppError(`Task with id '${id}' not found`, 404);
    }
    return task;
  }

  /**
   * Create a new task
   */
  async createTask(data) {
    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: data.status || "pending",
      priority: data.priority || "medium",
      dueDate: data.dueDate || null,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  /**
   * Update an existing task
   */
  async updateTask(id, data) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new AppError(`Task with id '${id}' not found`, 404);
    }

    const currentTask = this.tasks[index];
    const updatedTask = {
      ...currentTask,
      ...data,
      id: currentTask.id, // prevent ID overwrite
      createdAt: currentTask.createdAt, // preserve original creation time
      updatedAt: new Date().toISOString()
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new AppError(`Task with id '${id}' not found`, 404);
    }

    const [deletedTask] = this.tasks.splice(index, 1);
    return deletedTask;
  }

  /**
   * Get high-level task metrics for the dashboard header
   */
  async getTaskStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter((t) => t.status === "pending").length;
    const inProgress = this.tasks.filter((t) => t.status === "in_progress").length;
    const completed = this.tasks.filter((t) => t.status === "completed").length;
    const highPriority = this.tasks.filter((t) => t.priority === "high").length;

    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = this.tasks.filter(
      (t) => t.status !== "completed" && t.dueDate && t.dueDate < todayStr
    ).length;

    return {
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      overdue
    };
  }

  /**
   * Reset store to original seeds (useful for testing)
   */
  resetStore() {
    this.tasks = [...seedTasks];
    return this.tasks;
  }
}

// Export singleton instance
module.exports = new TaskService();
