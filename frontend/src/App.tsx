import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  ArrowDownUp,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
  BookOpen
} from "lucide-react";
import { taskApi } from "./services/api";
import type { Task, TaskStatus, TaskPriority, CreateTaskInput, UpdateTaskInput } from "./types/task";
import { useDebounce } from "./hooks/useDebounce";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed"
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High"
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "No due date";
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [sort, setSort] = useState<"created" | "priority" | "due">("created");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [modal, setModal] = useState<"create" | "edit" | "detail" | null>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [activeNav, setActiveNav] = useState<"overview" | "all" | "completed">("overview");

  // Fetch tasks from Express REST API
  const fetchTasksFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");
      const response = await taskApi.getTasks();
      setTasks(response.data);
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Failed to load tasks from server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksFromApi();
  }, [fetchTasksFromApi]);

  // Filter & sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesQuery = `${task.title} ${task.description}`
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase());
        const matchesStatus =
          activeNav === "completed"
            ? task.status === "completed"
            : statusFilter === "all" || task.status === statusFilter;
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sort === "priority") {
          const weight: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
          return weight[a.priority] - weight[b.priority];
        } else if (sort === "due") {
          return (a.dueDate || "").localeCompare(b.dueDate || "");
        } else {
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        }
      });
  }, [tasks, debouncedQuery, statusFilter, priorityFilter, sort, activeNav]);

  // Pagination slice
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter, priorityFilter, sort, activeNav]);

  // Metrics
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    high: tasks.filter((t) => t.priority === "high" && t.status !== "completed").length
  };

  // Create & Edit operations
  function openCreate() {
    setSelected(null);
    setModal("create");
  }

  function openEdit(task: Task) {
    setSelected(task);
    setModal("edit");
  }

  async function handleSaveTask(taskData: CreateTaskInput | UpdateTaskInput) {
    try {
      if (selected && modal === "edit") {
        const updated = await taskApi.updateTask(selected.id, taskData);
        setTasks((current) =>
          current.map((t) => (t.id === selected.id ? updated : t))
        );
      } else {
        const created = await taskApi.createTask(taskData as CreateTaskInput);
        setTasks((current) => [created, ...current]);
      }
      setModal(null);
      setSelected(null);
    } catch (err: any) {
      alert(err.message || "Failed to save task");
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      await taskApi.deleteTask(id);
      setTasks((current) => current.filter((t) => t.id !== id));
      setModal(null);
      setSelected(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete task");
    }
  }

  async function handleToggleStatus(task: Task) {
    const newStatus: TaskStatus = task.status === "completed" ? "in_progress" : "completed";
    try {
      // Optimistic update
      setTasks((current) =>
        current.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      await taskApi.updateTask(task.id, { status: newStatus });
    } catch {
      // Revert on error
      setTasks((current) =>
        current.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
    }
  }

  // Get current date string
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles />
          </div>
          <span>Taskflow</span>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">JD</div>
          <div>
            <p>Jordan&apos;s workspace</p>
            <span>Personal</span>
          </div>
          <ChevronDown className="workspace-chevron" />
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          <button
            className={`nav-item ${activeNav === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveNav("overview");
              setStatusFilter("all");
              setMobileNav(false);
            }}
          >
            <LayoutDashboard /> Overview
          </button>
          <button
            className={`nav-item ${activeNav === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveNav("all");
              setStatusFilter("all");
              setMobileNav(false);
            }}
          >
            <ListFilter /> All tasks <span className="nav-count">{tasks.length}</span>
          </button>
          <button
            className={`nav-item ${activeNav === "completed" ? "active" : ""}`}
            onClick={() => {
              setActiveNav("completed");
              setMobileNav(false);
            }}
          >
            <CheckCircle2 /> Completed
          </button>
        </nav>

        <div className="sidebar-section">
          <p className="eyebrow">Workspace</p>
          <button className="nav-item">
            <FileText /> Notes
          </button>
          <button className="nav-item">
            <CalendarDays /> Calendar
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles />
            </div>
            <p>Stay on top of your work</p>
            <span>Plan your day with Taskflow.</span>
            <button
              onClick={() => window.open("http://localhost:5000/api-docs", "_blank")}
            >
              Swagger API Docs <span>→</span>
            </button>
          </div>

          <div className="user-row">
            <div className="user-avatar">JD</div>
            <div>
              <strong>Jordan Davis</strong>
              <span>jordan@example.com</span>
            </div>
            <MoreHorizontal />
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileNav && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>
              {activeNav === "overview"
                ? "Overview"
                : activeNav === "all"
                ? "All tasks"
                : "Completed"}
            </strong>
          </div>
          <div className="topbar-actions">
            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="ghost-button"
              style={{ padding: "6px 10px", fontSize: "11px" }}
              title="Open Swagger REST API Docs"
            >
              <BookOpen style={{ width: 13, height: 13 }} /> API Docs
            </a>
            <button className="icon-button" aria-label="Notifications">
              <span className="notification-dot" />
              <AlertCircle />
            </button>
            <div className="topbar-avatar">JD</div>
          </div>
        </header>

        <div className="page-content">
          {/* Welcome Banner */}
          <section className="welcome-row">
            <div>
              <p className="section-kicker">{todayFormatted}</p>
              <h1>
                Good morning, Jordan <span>✦</span>
              </h1>
              <p className="subheading">
                Here&apos;s what&apos;s happening with your tasks today.
              </p>
            </div>
            <button className="primary-button" onClick={openCreate}>
              <Plus /> New task
            </button>
          </section>

          {/* Stats Cards Grid */}
          <section className="stats-grid" aria-label="Task summary">
            <StatCard
              label="Total tasks"
              value={stats.total}
              detail="Across your workspace"
              icon={<FileText />}
              tone="lavender"
            />
            <StatCard
              label="In progress"
              value={stats.active}
              detail="Tasks to keep moving"
              icon={<Clock3 />}
              tone="peach"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              detail={`${Math.round(
                (stats.completed / Math.max(stats.total, 1)) * 100
              )}% of all tasks`}
              icon={<CheckCircle2 />}
              tone="mint"
            />
            <StatCard
              label="High priority"
              value={stats.high}
              detail="Needs your attention"
              icon={<AlertCircle />}
              tone="rose"
            />
          </section>

          {/* Tasks Table Section */}
          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <h2>Your tasks</h2>
                <p>Keep track of everything on your plate.</p>
              </div>
              <button
                className="ghost-button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setSort("created");
                }}
              >
                <SlidersHorizontal /> Reset filters
              </button>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-box">
                <Search />
                <input
                  aria-label="Search tasks"
                  placeholder="Search tasks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val as typeof statusFilter)}
                  options={["all", "pending", "in_progress", "completed"]}
                />
                <FilterSelect
                  label="Priority"
                  value={priorityFilter}
                  onChange={(val) => setPriorityFilter(val as typeof priorityFilter)}
                  options={["all", "low", "medium", "high"]}
                />
                <button
                  className="sort-button"
                  onClick={() =>
                    setSort(
                      sort === "created"
                        ? "priority"
                        : sort === "priority"
                        ? "due"
                        : "created"
                    )
                  }
                >
                  <ArrowDownUp /> Sort ({sort})
                </button>
              </div>
            </div>

            {/* Loading / Error States */}
            {isLoading && (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontSize: "12px" }}>
                Loading tasks from backend...
              </div>
            )}

            {isError && (
              <div style={{ padding: "30px", textAlign: "center", color: "#cf6b72" }}>
                <p style={{ fontWeight: 600, fontSize: "13px" }}>{errorMessage}</p>
                <button
                  className="ghost-button"
                  style={{ marginTop: "10px" }}
                  onClick={fetchTasksFromApi}
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Task Table */}
            {!isLoading && !isError && (
              <div className="task-table">
                <div className="table-header">
                  <span>Task</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Due date</span>
                  <span />
                </div>

                {paginatedTasks.length === 0 ? (
                  <div className="empty-state">
                    <Search />
                    <h3>No tasks found</h3>
                    <p>Try changing your search or filters.</p>
                  </div>
                ) : (
                  paginatedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggleStatus={() => handleToggleStatus(task)}
                      onView={() => {
                        setSelected(task);
                        setModal("detail");
                      }}
                      onEdit={() => openEdit(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))
                )}
              </div>
            )}

            {/* Table Footer / Pagination */}
            {!isLoading && !isError && (
              <div className="table-footer">
                <span>
                  Showing <strong>{filteredTasks.length > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to{" "}
                  <strong>{Math.min(page * pageSize, filteredTasks.length)}</strong> of{" "}
                  <strong>{filteredTasks.length}</strong> tasks
                </span>

                <div className="pagination">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      className={pNum === page ? "page-active" : ""}
                      onClick={() => setPage(pNum)}
                    >
                      {pNum}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Task Modal (Create, Edit, Detail) */}
      {modal && (
        <TaskModal
          mode={modal}
          task={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onEdit={() => setModal("edit")}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
  tone
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "all"
              ? "All"
              : opt === "in_progress"
              ? "In progress"
              : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}

function TaskRow({
  task,
  onToggleStatus,
  onView,
  onEdit,
  onDelete
}: {
  task: Task;
  onToggleStatus: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="task-row">
      <button className="task-name" onClick={onView}>
        <span
          className={`task-check ${task.status === "completed" ? "checked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus();
          }}
          title={task.status === "completed" ? "Mark incomplete" : "Mark completed"}
        >
          {task.status === "completed" && <Check />}
        </span>
        <span>
          <strong>{task.title}</strong>
          <small>{task.description}</small>
        </span>
      </button>

      <span>
        <Badge kind={task.status}>{statusLabels[task.status]}</Badge>
      </span>

      <span>
        <Badge kind={task.priority}>{priorityLabels[task.priority]}</Badge>
      </span>

      <span className="due-date">{formatDate(task.dueDate)}</span>

      <div className="row-actions">
        <button onClick={onEdit} aria-label={`Edit ${task.title}`} title="Edit task">
          <Pencil />
        </button>
        <button onClick={onDelete} aria-label={`Delete ${task.title}`} title="Delete task">
          <Trash2 />
        </button>
      </div>
    </div>
  );
}

function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}

function TaskModal({
  mode,
  task,
  onClose,
  onSave,
  onDelete,
  onEdit
}: {
  mode: "create" | "edit" | "detail";
  task: Task | null;
  onClose: () => void;
  onSave: (taskData: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "pending");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.split("T")[0] : "2026-10-15"
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detail = mode === "detail";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate || null
      });
    } catch {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <p className="section-kicker">
              {detail ? "Task details" : task ? "Edit task" : "Create task"}
            </p>
            <h2 id="modal-title">
              {detail ? task?.title : task ? "Update task" : "Add a new task"}
            </h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        {detail && task ? (
          <div className="detail-content">
            <p className="detail-description">{task.description}</p>
            <div className="detail-grid">
              <div>
                <span>Status</span>
                <Badge kind={task.status}>{statusLabels[task.status]}</Badge>
              </div>
              <div>
                <span>Priority</span>
                <Badge kind={task.priority}>{priorityLabels[task.priority]}</Badge>
              </div>
              <div>
                <span>Due date</span>
                <strong>{formatDate(task.dueDate)}</strong>
              </div>
              <div>
                <span>Created</span>
                <strong>{formatDate(task.createdAt)}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="danger-button"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 /> Delete task
              </button>
              <button className="primary-button" onClick={onEdit}>
                <Pencil /> Edit task
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-fields">
              <label>
                Title
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. Plan next sprint"
                />
              </label>

              <label>
                Description
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="What needs to get done?"
                  rows={4}
                />
              </label>

              <div className="form-grid">
                <label>
                  Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>

              <label>
                Due date
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>

              {error && <p className="form-error">{error}</p>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="ghost-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : task
                  ? "Save changes"
                  : "Create task"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
