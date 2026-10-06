import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { Task } from "../../types/task";

export interface DeleteConfirmModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (task: Task) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(task);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium">
              Are you sure you want to delete this task?
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              &quot;{task.title}&quot; will be permanently removed from the task list.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirm} isLoading={isDeleting}>
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
