import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Plus } from "lucide-react";
import { ShimmerButton } from "../magicui/ShimmerButton";

export interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  sortBy: string;
  onSortByChange: (field: any) => void;
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
  viewMode: "list" | "kanban";
  onViewModeChange: (mode: "list" | "kanban") => void;
  onOpenCreateModal: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
  totalResults
}) => {
  const statuses: Array<{ value: string; label: string }> = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card/60 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Actions (View mode & Create task) */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => onViewModeChange("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => onViewModeChange("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Create Button (Magic UI Shimmer) */}
          <ShimmerButton onClick={onOpenCreateModal} className="h-10 px-4">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>New Task</span>
          </ShimmerButton>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-card/50 border border-border/60">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => onStatusChange(s.value)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === s.value
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Priority dropdown */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="h-8 pl-3 pr-8 text-xs font-medium rounded-xl border border-border/60 bg-card/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* Sort Controls & Counter */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="h-8 pl-2.5 pr-7 text-xs font-medium rounded-xl border border-border/60 bg-card/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onSortOrderToggle}
            className="h-8 px-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-accent text-xs font-medium flex items-center gap-1 transition-colors"
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            <span className="uppercase text-[10px] font-semibold">{sortOrder}</span>
          </button>

          <div className="text-xs text-muted-foreground font-medium pl-2 border-l border-border/40">
            {totalResults} {totalResults === 1 ? "task" : "tasks"}
          </div>
        </div>
      </div>
    </div>
  );
};
