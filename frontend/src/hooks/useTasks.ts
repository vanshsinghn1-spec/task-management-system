import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../services/api";
import type { Task, TaskStats, PaginationMeta, TaskStatus, CreateTaskInput, UpdateTaskInput } from "../types/task";
import { useDebounce } from "./useDebounce";
import { useToast } from "../components/layout/Toast";

export function useTasks() {
  const { toast, success, error } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    overdue: 0
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Lifecycle states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Active modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<TaskStatus>("pending");
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch stats summary
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await taskApi.getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load task stats", err);
    }
  }, []);

  // Fetch task list
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");

      const response = await taskApi.getTasks({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
        page,
        limit: viewMode === "kanban" ? 50 : 8 // fetch all tasks in kanban mode
      });

      setTasks(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Failed to load tasks");
      console.error("Task fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder, page, viewMode]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder, viewMode]);

  // Create Task
  const handleCreateTask = async (data: CreateTaskInput) => {
    try {
      const created = await taskApi.createTask(data);
      success(`Task "${created.title}" created successfully`);
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err: any) {
      error(err.message || "Failed to create task");
      throw err;
    }
  };

  // Update Task
  const handleUpdateTask = async (id: string, data: UpdateTaskInput) => {
    try {
      const updated = await taskApi.updateTask(id, data);
      success(`Task "${updated.title}" updated successfully`);
      
      // Update local state if currently inspected
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updated);
      }

      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err: any) {
      error(err.message || "Failed to update task");
      throw err;
    }
  };

  // Quick Status change with optimistic update
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const prevTasks = [...tasks];
    
    // Optimistic update
    setTasks((current) =>
      current.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      success(`Status updated to ${newStatus.replace("_", " ")}`);
      await fetchStats();
    } catch {
      // Revert optimistic update
      setTasks(prevTasks);
      error("Failed to update status");
    }
  };

  // Delete Task with optimistic deletion and undo notification
  const handleDeleteTask = async (taskToDelete: Task) => {
    try {
      await taskApi.deleteTask(taskToDelete.id);
      
      if (selectedTask && selectedTask.id === taskToDelete.id) {
        setIsDetailOpen(false);
        setSelectedTask(null);
      }

      toast(`Task "${taskToDelete.title}" deleted`, "info", {
        label: "Undo",
        onClick: async () => {
          // Re-create the deleted task
          await taskApi.createTask({
            title: taskToDelete.title,
            description: taskToDelete.description,
            status: taskToDelete.status,
            priority: taskToDelete.priority,
            dueDate: taskToDelete.dueDate
          });
          await Promise.all([fetchTasks(), fetchStats()]);
        }
      });

      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err: any) {
      error(err.message || "Failed to delete task");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const isFiltered = Boolean(
    searchTerm || statusFilter !== "all" || priorityFilter !== "all"
  );

  return {
    tasks,
    stats,
    pagination,
    isLoading,
    isError,
    errorMessage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    viewMode,
    setViewMode,
    isFiltered,
    clearFilters,
    fetchTasks,
    // Modals
    selectedTask,
    setSelectedTask,
    isDetailOpen,
    setIsDetailOpen,
    editingTask,
    setEditingTask,
    isModalOpen,
    setIsModalOpen,
    defaultStatusForNew,
    setDefaultStatusForNew,
    deletingTask,
    setDeletingTask,
    isDeleteOpen,
    setIsDeleteOpen,
    // Actions
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange
  };
}
