import React from "react";
import { ListFilter, Plus } from "lucide-react";
import { Button } from "../ui/Button";

export interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
  onCreateTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onCreateTask
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 backdrop-blur-xs my-6">
      <div className="h-14 w-14 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
        <ListFilter className="h-7 w-7 text-primary/70" />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {isFiltered ? "No matching tasks found" : "No tasks yet"}
      </h3>

      <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
        {isFiltered
          ? "No tasks match your current filters or search term. Try adjusting your search query or reset your filters."
          : "Get started by adding your first task to manage your workflow smoothly."}
      </p>

      <div className="flex items-center gap-3 mt-6">
        {isFiltered ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Reset Filters
          </Button>
        ) : (
          <Button size="sm" onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create First Task
          </Button>
        )}
      </div>
    </div>
  );
};
