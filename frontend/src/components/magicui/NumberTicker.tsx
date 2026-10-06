import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  duration?: number;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  className,
  duration = 600
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + (endValue - startValue) * easeOutQuad);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  return <span className={cn("tabular-nums font-semibold", className)}>{displayValue}</span>;
};
