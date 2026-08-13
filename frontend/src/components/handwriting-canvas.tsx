"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, PenTool } from "lucide-react";
import { Button } from "./ui/button";

interface HandwritingCanvasProps {
  onCapture: (base64: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  intendedLetter: string;
}

export function HandwritingCanvas({
  onCapture,
  onClear,
  disabled = false,
  intendedLetter,
}: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  // Redraws the background and guidelines on a given canvas context
  const renderBackground = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, withGuidelines: boolean) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      if (withGuidelines) {
        ctx.save();
        ctx.lineWidth = 1;

        // Top Sky line (blue)
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.beginPath();
        ctx.moveTo(12, height * 0.25);
        ctx.lineTo(width - 12, height * 0.25);
        ctx.stroke();

        // Middle Dashed midline
        ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(12, height * 0.5);
        ctx.lineTo(width - 12, height * 0.5);
        ctx.stroke();

        // Bottom Grass baseline (green)
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
        ctx.beginPath();
        ctx.moveTo(12, height * 0.75);
        ctx.lineTo(width - 12, height * 0.75);
        ctx.stroke();

        ctx.restore();
      }
    },
    [],
  );

  // Initialize canvas only on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderBackground(ctx, canvas.width, canvas.height, showGuidelines);
  }, [renderBackground, showGuidelines]);

  // Explicit user clear action
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderBackground(ctx, canvas.width, canvas.height, showGuidelines);
    setHasContent(false);

    if (onClear) {
      onClear();
    }
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#1e293b";

    setIsDrawing(true);
    setHasContent(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    exportCanvas();
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 label-mono text-xs text-foreground">
          <PenTool className="size-3.5 text-primary-strong" />
          <span>Draw Character: <strong className="text-primary font-mono text-sm uppercase">'{intendedLetter}'</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="label-mono text-[0.625rem] text-muted-foreground hover:text-foreground underline cursor-pointer"
          >
            {showGuidelines ? "Hide Lines" : "Show Lines"}
          </button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleClear}
            disabled={!hasContent || disabled}
          >
            <RotateCcw className="size-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-lg border-2 border-border bg-white shadow-[var(--shadow-xs)]">
        <canvas
          ref={canvasRef}
          width={360}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[280px] touch-none cursor-crosshair block"
        />

        {!hasContent && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <PenTool className="size-6 mb-1.5 opacity-30 text-slate-500" />
            <p className="label-mono text-[0.6875rem] text-slate-500">
              Draw letter '{intendedLetter}' inside the box
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HandwritingCanvas;
