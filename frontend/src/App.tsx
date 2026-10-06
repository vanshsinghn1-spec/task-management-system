import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { ToastProvider } from "./components/layout/Toast";
import { BackgroundGrid } from "./components/aceternity/BackgroundGrid";
import { MetricsBar } from "./components/dashboard/MetricsBar";
import { FilterBar } from "./components/dashboard/FilterBar";
import { TaskListView } from "./components/tasks/TaskListView";
import { TaskKanbanView } from "./components/tasks/TaskKanbanView";
import { TaskModal } from "./components/tasks/TaskModal";
import { TaskDetailSheet } from "./components/tasks/TaskDetailSheet";
import { DeleteConfirmModal } from "./components/tasks/DeleteConfirmModal";
import { EmptyState } from "./components/tasks/EmptyState";
import { Skeleton } from "./components/ui/Skeleton";
import { Button } from "./components/ui/Button";
import { useTasks } from "./hooks/useTasks";
import type { Task, TaskStatus } from "./types/task";
import { AlertCircle, RefreshCw } from "lucide-react";

function MainDashboard() {
  const {
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
  } = useTasks();

  // Keyboard shortcut: Press "N" to create task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "n" || e.key === "N") &&
        !isModalOpen &&
        !isDetailOpen &&
        !isDeleteOpen &&
        !(["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName))
      ) {
        e.preventDefault();
        openCreateModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isDetailOpen, isDeleteOpen]);

  const openCreateModal = (status: TaskStatus = "pending") => {
    setEditingTask(null);
    setDefaultStatusForNew(status);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openDetailDrawer = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteOpen(true);
  };

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Metric counters */}
      <MetricsBar stats={stats} isLoading={isLoading && tasks.length === 0} />

      {/* Filter and control toolbar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateModal={() => openCreateModal()}
        totalResults={pagination.totalCount}
      />

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 my-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-destructive font-semibold">
            <AlertCircle className="h-5 w-5" />
            <span>Connection Error</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {errorMessage || "Unable to reach the backend server. Please verify the API server is running on port 5000."}
          </p>
          <Button variant="outline" size="sm" onClick={() => fetchTasks()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry Request
          </Button>
        </div>
      )}

      {/* Loading state skeletons */}
      {isLoading && (
        <div className="space-y-3 my-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && tasks.length === 0 && (
        <EmptyState
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
          onCreateTask={() => openCreateModal()}
        />
      )}

      {/* Content Views */}
      {!isLoading && !isError && tasks.length > 0 && (
        <>
          {viewMode === "list" ? (
            <TaskListView
              tasks={tasks}
              pagination={pagination}
              onPageChange={setPage}
              onView={openDetailDrawer}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TaskKanbanView
              tasks={tasks}
              onView={openDetailDrawer}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onStatusChange={handleStatusChange}
              onOpenCreateWithStatus={(st) => openCreateModal(st)}
            />
          )}
        </>
      )}

      {/* Modals & Drawers */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (editingTask) {
            await handleUpdateTask(editingTask.id, data);
          } else {
            await handleCreateTask(data as any);
          }
        }}
        initialData={editingTask}
        defaultStatus={defaultStatusForNew}
      />

      <TaskDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onEdit={(task) => {
          setIsDetailOpen(false);
          openEditModal(task);
        }}
        onDelete={(task) => {
          setIsDetailOpen(false);
          openDeleteModal(task);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        task={deletingTask}
        onConfirm={handleDeleteTask}
      />
    </main>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("taskflow-theme");
    return saved ? saved === "dark" : true; // Default dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("taskflow-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("taskflow-theme", "light");
    }
  }, [isDark]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
        <BackgroundGrid />
        <Navbar isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />
        <MainDashboard />
      </div>
    </ToastProvider>
  );
}
