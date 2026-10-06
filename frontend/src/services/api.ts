import type {
  Task,
  TaskStats,
  TaskFilterParams,
  PaginationMeta,
  CreateTaskInput,
  UpdateTaskInput
} from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  errors?: Array<{ field: string; message: string }>;
  statusCode: number;

  constructor(message: string, statusCode: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errors;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
      errors = errorJson.errors;
    } catch {
      // Body not JSON
    }
    throw new ApiError(errorMessage, response.status, errors);
  }
  return response.json();
}

export const taskApi = {
  /**
   * Fetch tasks with query filters, search, sorting, and pagination
   */
  async getTasks(params?: TaskFilterParams): Promise<{ data: Task[]; pagination: PaginationMeta }> {
    const url = new URL(`${API_BASE_URL}/tasks`);

    if (params) {
      if (params.search) url.searchParams.set("search", params.search);
      if (params.status && params.status !== "all") url.searchParams.set("status", params.status);
      if (params.priority && params.priority !== "all") url.searchParams.set("priority", params.priority);
      if (params.sortBy) url.searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) url.searchParams.set("sortOrder", params.sortOrder);
      if (params.page) url.searchParams.set("page", params.page.toString());
      if (params.limit) url.searchParams.set("limit", params.limit.toString());
    }

    const res = await fetch(url.toString());
    return handleResponse<{ data: Task[]; pagination: PaginationMeta }>(res);
  },

  /**
   * Fetch single task details by ID
   */
  async getTaskById(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
    const result = await handleResponse<{ success: boolean; data: Task }>(res);
    return result.data;
  },

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });
    const result = await handleResponse<{ success: boolean; message: string; data: Task }>(res);
    return result.data;
  },

  /**
   * Update an existing task
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });
    const result = await handleResponse<{ success: boolean; message: string; data: Task }>(res);
    return result.data;
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE"
    });
    const result = await handleResponse<{ success: boolean; message: string; data: Task }>(res);
    return result.data;
  },

  /**
   * Fetch dashboard statistics
   */
  async getTaskStats(): Promise<TaskStats> {
    const res = await fetch(`${API_BASE_URL}/tasks/stats/summary`);
    const result = await handleResponse<{ success: boolean; data: TaskStats }>(res);
    return result.data;
  }
};

export { ApiError };
