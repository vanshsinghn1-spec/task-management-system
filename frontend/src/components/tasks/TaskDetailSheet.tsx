import React from "react";
import { Calendar, Clock, Edit2, Trash2, Copy, Check, Hash, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Sheet } from "../ui/Sheet";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Task, TaskStatus } from "../../types/task";
import { formatDate, isPastDue } from "../../lib/utils";

export interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!task) return null;

  const isOverdue = isPastDue(task.dueDate) && task.status !== "completed";

  const handleCopyId = () => {
    navigator.clipboard.writeText(task.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleComplete = () => {
    if (task.status === "completed") {
      onStatusChange(task.id, "in_progress");
    } else {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      onStatusChange(task.id, "completed");
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      description="Detailed inspector and lifecycle management"
    >
      <div className="space-y-6">
        {/* Quick ID Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
            <Hash className="h-3.5 w-3.5 text-primary" />
            <span>{task.id}</span>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-md hover:bg-accent transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Task Title
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-snug">
            {task.title}
          </h1>
        </div>

        {/* Status & Priority Controls */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-border/70 bg-card/60">
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Current Status
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={task.status} />
            </div>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="mt-1 text-xs w-full rounded-lg border border-border/60 bg-background/80 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <option value="pending">Change: Pending</option>
              <option value="in_progress">Change: In Progress</option>
              <option value="completed">Change: Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Priority Level
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </div>
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {task.description}
          </div>
        </div>

        {/* Metadata Timeline */}
        <div className="space-y-2 p-3.5 rounded-xl border border-border/60 bg-card/40 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Due Date:
            </span>
            <span className={`font-medium ${isOverdue ? "text-rose-500 font-semibold" : "text-foreground"}`}>
              {formatDate(task.dueDate)} {isOverdue && "(Overdue)"}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Created:
            </span>
            <span className="font-mono text-foreground">{new Date(task.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Last Updated:
            </span>
            <span className="font-mono text-foreground">{new Date(task.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
          <Button
            variant={task.status === "completed" ? "secondary" : "primary"}
            size="sm"
            onClick={handleToggleComplete}
            className="flex-1"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            {task.status === "completed" ? "Mark In Progress" : "Complete Task"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(task);
            }}
          >
            <Edit2 className="h-4 w-4 mr-1.5" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
