import React from "react";
import { cn } from "../../lib/utils";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "12px",
      background = "hsl(var(--primary))",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-4 py-2 text-white [background:var(--bg)] [border-radius:var(--radius)] active:scale-95 transition-transform duration-200 shadow-md shadow-primary/20 hover:shadow-primary/40 font-medium text-sm",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spark container */}
        <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-shimmer [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* Spark line */}
            <div className="animate-spin-slow [animation-duration:var(--speed)] absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        {/* Backdrop overlay */}
        <div className="absolute [inset:var(--cut)] -z-20 [border-radius:calc(var(--radius)-var(--cut))] [background:var(--bg)]" />

        <div className="relative z-10 flex items-center gap-2">{children}</div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
