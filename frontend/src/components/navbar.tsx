"use client";

import Link from "next/link";
import { Activity, Sun, Moon } from "lucide-react";
import { useTheme } from "@/store/theme";

export function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-app flex h-14 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-2xs)]">
            <Activity className="size-4" strokeWidth={2.25} />
          </div>
          <span className="label-mono text-sm leading-none text-foreground font-semibold">
            NeuroTrace
          </span>
          <span className="label-mono text-[0.625rem] text-primary-strong bg-accent/60 dark:bg-accent/15 px-1.5 py-0.5 rounded border border-border">
            v1.0
          </span>
        </Link>

        {/* Right Actions & Theme Switcher */}
        <div className="flex items-center gap-3">
          <span className="label-mono text-[0.6875rem] text-muted-foreground">
            EfficientNet-B0
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
            className="relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 shadow-[var(--shadow-2xs)]"
          >
            <Sun
              className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden"
              strokeWidth={2}
            />
            <Moon
              className="hidden size-4 rotate-90 scale-0 transition-all dark:block dark:rotate-0 dark:scale-100"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
