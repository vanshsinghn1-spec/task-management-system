import React from "react";
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, ListTodo } from "lucide-react";
import { NumberTicker } from "../magicui/NumberTicker";
import type { TaskStats } from "../../types/task";

export interface MetricsBarProps {
  stats: TaskStats;
  isLoading?: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ stats, isLoading }) => {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const items = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: <ListTodo className="h-4 w-4 text-primary" />,
      subtext: "In-memory store"
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
      subtext: "Active execution"
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      subtext: "Awaiting start"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      subtext: `${completionPercentage}% finished`
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
      subtext: stats.overdue > 0 ? "Requires attention" : "All on schedule",
      alert: stats.overdue > 0
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`relative rounded-2xl border p-4 transition-all duration-200 bg-card/60 backdrop-blur-sm ${
            item.alert
              ? "border-rose-500/30 bg-rose-500/[0.03]"
              : "border-border/80 hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">{item.label}</span>
            <div className="p-1.5 rounded-lg bg-background/80 border border-border/50">
              {item.icon}
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {isLoading ? "—" : <NumberTicker value={item.value} />}
          </div>
          <p
            className={`text-[11px] mt-1 font-medium ${
              item.alert ? "text-rose-500 font-semibold" : "text-muted-foreground"
            }`}
          >
            {item.subtext}
          </p>
        </div>
      ))}
    </div>
  );
};
