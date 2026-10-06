const swaggerJsDoc = {
  openapi: "3.0.0",
  info: {
    title: "Task Management REST API",
    version: "1.0.0",
    description: "RESTful API for the Task Management System with in-memory persistence.",
    contact: {
      name: "SDE Internship Candidate"
    }
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server"
    }
  ],
  paths: {
    "/api/tasks": {
      get: {
        summary: "Retrieve all tasks",
        description: "Returns an array of tasks with optional filtering, search, sorting, and pagination.",
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Search term to match in task title or description",
            schema: { type: "string" }
          },
          {
            name: "status",
            in: "query",
            description: "Filter by task status",
            schema: { type: "string", enum: ["all", "pending", "in_progress", "completed"] }
          },
          {
            name: "priority",
            in: "query",
            description: "Filter by task priority",
            schema: { type: "string", enum: ["all", "low", "medium", "high"] }
          },
          {
            name: "sortBy",
            in: "query",
            description: "Field to sort by",
            schema: { type: "string", enum: ["createdAt", "dueDate", "priority", "title"] }
          },
          {
            name: "sortOrder",
            in: "query",
            description: "Sort direction",
            schema: { type: "string", enum: ["asc", "desc"] }
          },
          {
            name: "page",
            in: "query",
            description: "Page number (for pagination)",
            schema: { type: "integer", default: 1 }
          },
          {
            name: "limit",
            in: "query",
            description: "Number of items per page",
            schema: { type: "integer", default: 10 }
          }
        ],
        responses: {
          200: {
            description: "List of tasks retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" }
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create a new task",
        description: "Creates and adds a new task to the in-memory store.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task created successfully" },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/tasks/{id}": {
      get: {
        summary: "Retrieve task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the task",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Task details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        summary: "Update task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the task",
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskInput" }
            }
          }
        },
        responses: {
          200: {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task updated successfully" },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        summary: "Delete task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the task",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Task deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task deleted successfully" },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/tasks/stats/summary": {
      get: {
        summary: "Get task distribution metrics",
        responses: {
          200: {
            description: "Task statistics summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        total: { type: "integer", example: 6 },
                        pending: { type: "integer", example: 2 },
                        inProgress: { type: "integer", example: 2 },
                        completed: { type: "integer", example: 2 },
                        highPriority: { type: "integer", example: 2 },
                        overdue: { type: "integer", example: 0 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "task-001" },
          title: { type: "string", example: "Implement Authentication Module" },
          description: { type: "string", example: "Design and implement JWT-based auth flow." },
          status: { type: "string", enum: ["pending", "in_progress", "completed"], example: "in_progress" },
          priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
          dueDate: { type: "string", format: "date", example: "2026-10-15" },
          createdAt: { type: "string", format: "date-time", example: "2026-10-01T09:30:00.000Z" },
          updatedAt: { type: "string", format: "date-time", example: "2026-10-02T14:15:00.000Z" }
        }
      },
      CreateTaskInput: {
        type: "object",
        required: ["title", "description"],
        properties: {
          title: { type: "string", example: "Build unit tests" },
          description: { type: "string", example: "Write Jest tests for the service layer" },
          status: { type: "string", enum: ["pending", "in_progress", "completed"], default: "pending" },
          priority: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
          dueDate: { type: "string", format: "date", example: "2026-10-25" }
        }
      },
      UpdateTaskInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["pending", "in_progress", "completed"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          dueDate: { type: "string", format: "date" }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalCount: { type: "integer", example: 6 },
          totalPages: { type: "integer", example: 1 },
          hasNextPage: { type: "boolean", example: false },
          hasPrevPage: { type: "boolean", example: false }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = { swaggerJsDoc };
