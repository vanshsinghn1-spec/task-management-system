import React from "react";
import { Calendar, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { CardSpotlight } from "../aceternity/CardSpotlight";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import type { Task, TaskStatus } from "../../types/task";
import { formatDate, isPastDue } from "../../lib/utils";

export interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const isOverdue = isPastDue(task.dueDate) && task.status !== "completed";

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === "completed") {
      onStatusChange(task.id, "in_progress");
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#10b981", "#6366f1", "#3b82f6"]
      });
      onStatusChange(task.id, "completed");
    }
  };

  return (
    <CardSpotlight
      onClick={() => onView(task)}
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        task.status === "completed" ? "opacity-75 bg-card/40" : ""
      } ${
        task.priority === "high" && task.status !== "completed"
          ? "border-rose-500/30 dark:border-rose-500/20 shadow-xs"
          : ""
      }`}
    >
      <div className="flex flex-col h-full justify-between gap-3">
        {/* Top Header: Status & Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`rounded-full p-0.5 transition-colors ${
                task.status === "completed"
                  ? "text-emerald-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={task.status === "completed" ? "Mark incomplete" : "Mark completed"}
            >
              <CheckCircle2
                className={`h-4 w-4 ${
                  task.status === "completed" ? "fill-emerald-500/20 text-emerald-500" : ""
                }`}
              />
            </button>
            <StatusBadge status={task.status} size="sm" />
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <PriorityBadge priority={task.priority} size="sm" />
            
            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Edit task"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Title & Description */}
        <div className="space-y-1.5">
          <h3
            className={`font-semibold text-sm tracking-tight text-foreground line-clamp-2 ${
              task.status === "completed" ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Bottom Footer: Dates & Quick Status Selector */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span className={isOverdue ? "text-rose-500 font-semibold" : ""}>
              {formatDate(task.dueDate)}
            </span>
            {isOverdue && (
              <span className="px-1 py-0.2 rounded bg-rose-500/10 text-rose-500 font-semibold uppercase text-[9px]">
                Overdue
              </span>
            )}
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="text-[11px] bg-transparent border-0 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer py-0 pr-4 pl-1"
            >
              <option value="pending" className="bg-card text-foreground">Pending</option>
              <option value="in_progress" className="bg-card text-foreground">In Progress</option>
              <option value="completed" className="bg-card text-foreground">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </CardSpotlight>
  );
};
