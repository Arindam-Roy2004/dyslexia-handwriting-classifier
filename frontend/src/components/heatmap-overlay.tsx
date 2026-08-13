"use client";

import React, { useRef, useEffect, useState } from "react";
import { Eye, Layers, Sliders } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface HeatmapOverlayProps {
  originalImageBase64?: string;
  heatmapMatrix: number[][];
  prediction: "Normal" | "Reversal" | "Corrected";
  gradCamSummary: string;
}

export function HeatmapOverlay({
  originalImageBase64,
  heatmapMatrix,
  prediction,
  gradCamSummary,
}: HeatmapOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [opacity, setOpacity] = useState(0.65);
  const [showOverlayOnly, setShowOverlayOnly] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !heatmapMatrix || heatmapMatrix.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = heatmapMatrix.length;
    const cols = heatmapMatrix[0].length;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (originalImageBase64 && !showOverlayOnly) {
      const img = new Image();
      img.src = originalImageBase64;
      img.onload = () => {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawHeatmapLayer(ctx, rows, cols, cellW, cellH);
      };
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawHeatmapLayer(ctx, rows, cols, cellW, cellH);
    }
  }, [originalImageBase64, heatmapMatrix, opacity, showOverlayOnly]);

  const drawHeatmapLayer = (
    ctx: CanvasRenderingContext2D,
    rows: number,
    cols: number,
    cellW: number,
    cellH: number,
  ) => {
    ctx.globalAlpha = opacity;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = heatmapMatrix[r][c];
        if (val > 0.05) {
          ctx.fillStyle = getHeatmapColor(val);
          ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
        }
      }
    }
    ctx.globalAlpha = 1.0;
  };

  const getHeatmapColor = (value: number): string => {
    const v = Math.max(0, Math.min(1, value));
    let r = 0;
    let g = 0;
    let b = 0;

    if (v < 0.25) {
      r = 0;
      g = Math.floor(255 * (v / 0.25));
      b = 255;
    } else if (v < 0.5) {
      r = 0;
      g = 255;
      b = Math.floor(255 * (1 - (v - 0.25) / 0.25));
    } else if (v < 0.75) {
      r = Math.floor(255 * ((v - 0.5) / 0.25));
      g = 255;
      b = 0;
    } else {
      r = 255;
      g = Math.floor(255 * (1 - (v - 0.75) / 0.25));
      b = 0;
    }

    return `rgba(${r}, ${g}, ${b}, ${0.85})`;
  };

  return (
    <Card>
      <CardHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <CardTitle className="text-sm">
              GradCAM Stroke Activation
            </CardTitle>
          </div>
          <Badge
            variant={
              prediction === "Normal"
                ? "success"
                : prediction === "Reversal"
                ? "destructive"
                : "warning"
            }
          >
            {prediction}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Heatmap Canvas */}
        <div className="relative flex justify-center items-center rounded-lg bg-muted/60 border border-border p-2">
          <canvas
            ref={canvasRef}
            width={260}
            height={260}
            className="rounded border border-border shadow-[var(--shadow-2xs)] block"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-[0.6875rem] label-mono text-muted-foreground bg-muted/40 p-2 rounded-md border border-border">
          <div className="flex items-center gap-2">
            <Sliders className="size-3" />
            <span>Opacity:</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 accent-primary cursor-pointer"
            />
            <span className="text-foreground font-mono">{Math.round(opacity * 100)}%</span>
          </div>

          <button
            type="button"
            onClick={() => setShowOverlayOnly(!showOverlayOnly)}
            className="text-foreground underline text-[0.625rem] cursor-pointer"
          >
            {showOverlayOnly ? "Show Ink" : "Heatmap Only"}
          </button>
        </div>

        <p className="text-xs text-foreground/90 leading-relaxed bg-accent/30 dark:bg-accent/10 border border-border p-3 rounded-md">
          <strong className="text-primary-strong">Attention Region: </strong>
          {gradCamSummary}
        </p>
      </CardContent>
    </Card>
  );
}

export default HeatmapOverlay;
