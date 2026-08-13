import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "label-mono inline-flex h-5.5 w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-[0.625rem] whitespace-nowrap shadow-none transition-colors",
        {
          "bg-primary text-primary-foreground border-transparent":
            variant === "default",
          "bg-secondary text-secondary-foreground border-border":
            variant === "secondary",
          "bg-destructive text-destructive-foreground border-transparent":
            variant === "destructive",
          "bg-background text-foreground border-border":
            variant === "outline",
          "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30":
            variant === "success",
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30":
            variant === "warning",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
