import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "xs" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group/button label-mono inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 text-xs whitespace-nowrap shadow-[var(--shadow-2xs)] transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out hover:-translate-y-px hover:shadow-[var(--shadow-xs)] active:translate-y-0 active:shadow-none outline-none select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          {
            "bg-primary text-primary-foreground border-transparent hover:bg-primary/90":
              variant === "default",
            "bg-background text-foreground hover:bg-muted":
              variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            "border-transparent bg-transparent shadow-none text-muted-foreground hover:bg-muted hover:text-foreground":
              variant === "ghost",
            "bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90":
              variant === "destructive",
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-[0.6875rem]": size === "sm",
            "h-7 px-2 text-[0.625rem]": size === "xs",
            "h-11 px-6 text-sm": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
