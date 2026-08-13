import React from "react";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 mt-16 text-xs text-muted-foreground">
      <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <span className="label-mono text-xs text-foreground">NeuroTrace AI</span>
          <span className="text-muted-foreground/60">•</span>
          <span>Dyslexia Handwriting Screening System</span>
        </div>
        <p className="label-mono text-[0.6875rem]">
          EfficientNet-B0 + GradCAM XAI Model Architecture
        </p>
      </div>
    </footer>
  );
}

export default Footer;
