import React from "react";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "../../types/task";
import { TaskCard } from "./TaskCard";

export interface TaskKanbanViewProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateWithStatus: (status: TaskStatus) => void;
}

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateWithStatus
}) => {
  const columns: Array<{
    id: TaskStatus;
    title: string;
    dotColor: string;
    headerBg: string;
  }> = [
    {
      id: "pending",
      title: "Pending",
      dotColor: "bg-amber-500",
      headerBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    },
    {
      id: "in_progress",
      title: "In Progress",
      dotColor: "bg-blue-500 animate-pulse",
      headerBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    },
    {
      id: "completed",
      title: "Completed",
      dotColor: "bg-emerald-500",
      headerBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl border border-border/80 bg-muted/20 p-3.5 backdrop-blur-xs min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="font-semibold text-sm tracking-tight text-foreground">
                  {col.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground border border-border/60">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenCreateWithStatus(col.id)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title={`Add ${col.title} Task`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="flex flex-col gap-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-border/60 rounded-xl text-center text-xs text-muted-foreground">
                  No {col.title.toLowerCase()} tasks
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
