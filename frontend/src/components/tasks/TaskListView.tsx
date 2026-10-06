import React from "react";
import { Edit2, Trash2, Eye, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { Task, TaskStatus, PaginationMeta } from "../../types/task";
import { PriorityBadge } from "../ui/Badge";
import { formatDate, isPastDue } from "../../lib/utils";

export interface TaskListViewProps {
  tasks: Task[];
  pagination?: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60 select-none">
              <tr>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Task</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {tasks.map((task) => {
                const isOverdue = isPastDue(task.dueDate) && task.status !== "completed";
                return (
                  <tr
                    key={task.id}
                    onClick={() => onView(task)}
                    className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    {/* Status Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                          className="bg-transparent text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary rounded-lg py-1 px-1.5"
                        >
                          <option value="pending" className="bg-card text-foreground">🟡 Pending</option>
                          <option value="in_progress" className="bg-card text-foreground">🔵 In Progress</option>
                          <option value="completed" className="bg-card text-foreground">🟢 Completed</option>
                        </select>
                      </div>
                    </td>

                    {/* Task Title & Description Column */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {task.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-sm mt-0.5">
                        {task.description}
                      </div>
                    </td>

                    {/* Priority Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} size="sm" />
                    </td>

                    {/* Due Date Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                        <span className={isOverdue ? "text-rose-500 font-semibold" : ""}>
                          {formatDate(task.dueDate)}
                        </span>
                        {isOverdue && (
                          <span className="px-1 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold text-[9px] uppercase">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created At Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(task.createdAt)}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(task)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(task)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(task)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{pagination.totalCount}</span> tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
