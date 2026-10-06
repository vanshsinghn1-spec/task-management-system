import React from "react";
import { cn } from "../../lib/utils";
import type { TaskPriority, TaskStatus } from "../../types/task";

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = "md" }) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500"
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      dot: "bg-blue-500 animate-pulse"
    },
    completed: {
      label: "Completed",
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-500"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs gap-1.5" : "px-2.5 py-1 text-xs gap-2";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors",
        config.bg,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
};

export interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  size?: "sm" | "md";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className, size = "md" }) => {
  const priorityConfig = {
    low: {
      label: "Low",
      classes: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
    },
    medium: {
      label: "Medium",
      classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    },
    high: {
      label: "High",
      classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border uppercase tracking-wider",
        config.classes,
        sizeClasses,
        className
      )}
    >
      {config.label}
    </span>
  );
};
