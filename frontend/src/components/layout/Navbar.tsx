import React, { useEffect, useState } from "react";
import { Moon, Sun, BookOpen, Layers } from "lucide-react";

export interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, onToggleTheme }) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch("http://localhost:5000/health");
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-primary/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                TaskFlow
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                REST Core
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Full-Stack Task Management
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* API Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-border/60 bg-card/60 text-xs text-muted-foreground">
            <span
              className={`h-2 w-2 rounded-full ${
                apiOnline === null
                  ? "bg-amber-400 animate-pulse"
                  : apiOnline
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-[11px] font-medium">
              {apiOnline === null ? "Connecting..." : apiOnline ? "API Online :5000" : "API Offline"}
            </span>
          </div>

          {/* Swagger Link */}
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 hover:bg-accent text-xs font-medium text-foreground transition-all duration-150"
            title="Open Swagger OpenAPI Documentation"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="hidden md:inline">Swagger API Docs</span>
            <span className="md:hidden">Docs</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-xl border border-border/80 bg-card/60 hover:bg-accent text-foreground flex items-center justify-center transition-all duration-150"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
