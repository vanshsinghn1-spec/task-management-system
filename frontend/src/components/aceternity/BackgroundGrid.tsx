import React from "react";
import { cn } from "../../lib/utils";

export interface BackgroundGridProps {
  className?: string;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 select-none overflow-hidden",
        className
      )}
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 dark:opacity-30" />
      {/* Radial vignette mask */}
      <div className="absolute inset-0 bg-radial-gradient [background:radial-gradient(circle_at_50%_0%,transparent_20%,hsl(var(--background))_90%)]" />
    </div>
  );
};
