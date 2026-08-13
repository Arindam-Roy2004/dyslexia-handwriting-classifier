"use client";

import React, { useState } from "react";
import {
  PenTool,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
} from "lucide-react";
import HandwritingCanvas from "@/components/handwriting-canvas";
import FileUploadZone from "@/components/file-upload-zone";
import HeatmapOverlay from "@/components/heatmap-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ApiClient, { AssessmentResult } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"canvas" | "upload">("canvas");
  const [intendedLetter, setIntendedLetter] = useState<string>("b");

  // Inputs
  const [canvasBase64, setCanvasBase64] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableLetters = ["b", "d", "p", "q", "m", "w", "n", "u"];

  const handleTabChange = (tab: "canvas" | "upload") => {
    setActiveTab(tab);
    setResult(null);
    setErrorMsg(null);
  };

  const handleLetterChange = (letter: string) => {
    setIntendedLetter(letter);
    setResult(null);
    setErrorMsg(null);
  };

  const handleClearCanvas = () => {
    setCanvasBase64(null);
    setResult(null);
    setErrorMsg(null);
  };

  const handleFileSelect = (file: File | null) => {
    setUploadedFile(file);
    if (!file) {
      setResult(null);
    }
    setErrorMsg(null);
  };

  const handleRunTest = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (activeTab === "canvas") {
        if (!canvasBase64) {
          setErrorMsg("Please draw a character on the canvas before running screening.");
          setIsLoading(false);
          return;
        }
        const res = await ApiClient.predictCanvas(canvasBase64, intendedLetter);
        setResult(res);
      } else {
        if (!uploadedFile) {
          setErrorMsg("Please select an image file to upload.");
          setIsLoading(false);
          return;
        }
        const res = await ApiClient.predictUpload(uploadedFile, intendedLetter);
        setResult(res);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to analyze image.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSegmentScore = (prob: number) => {
    if (prob < 0.2) return 1;
    if (prob < 0.4) return 2;
    if (prob < 0.6) return 3;
    if (prob < 0.8) return 4;
    return 5;
  };

  return (
    <div className="container-app py-10 space-y-10">
      {/* Centered Middle Region Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <span className="eyebrow inline-block">SCREENING &amp; CLASSIFICATION</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
          Handwriting Dyslexia Classifier
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Screen handwritten characters for spatial directionality deficits (e.g. <strong>b vs d</strong> mirroring), stroke overwriting, and normal formations using <strong>EfficientNet-B0 and GradCAM explainability</strong>.
        </p>
      </div>

      {/* Symmetrical Two-Box Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Box: Input & Ingestion */}
        <Card className="flex flex-col h-full border border-border shadow-[var(--shadow-xs)]">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="size-4 text-primary" />
                <CardTitle className="text-sm">1. Input Character</CardTitle>
              </div>
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => handleTabChange("canvas")}
                  className={cn(
                    "label-mono flex items-center gap-1 px-2.5 py-1 rounded text-[0.6875rem] transition-colors cursor-pointer",
                    activeTab === "canvas"
                      ? "bg-card text-foreground shadow-[var(--shadow-2xs)] font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <PenTool className="size-3" />
                  Canvas
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("upload")}
                  className={cn(
                    "label-mono flex items-center gap-1 px-2.5 py-1 rounded text-[0.6875rem] transition-colors cursor-pointer",
                    activeTab === "upload"
                      ? "bg-card text-foreground shadow-[var(--shadow-2xs)] font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <UploadCloud className="size-3" />
                  Upload
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Target Character Selection */}
              <div>
                <label className="label-mono text-[0.6875rem] text-muted-foreground block mb-1.5">
                  Target Character:
                </label>
                <div className="grid grid-cols-8 gap-1.5">
                  {availableLetters.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleLetterChange(l)}
                      className={cn(
                        "label-mono h-8 rounded border text-xs font-bold transition-all cursor-pointer",
                        intendedLetter === l
                          ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-2xs)]"
                          : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingestion Surface */}
              {activeTab === "canvas" ? (
                <HandwritingCanvas
                  intendedLetter={intendedLetter}
                  onCapture={(b64) => setCanvasBase64(b64)}
                  onClear={handleClearCanvas}
                  disabled={isLoading}
                />
              ) : (
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  disabled={isLoading}
                />
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <Info className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Test Action Button */}
            <div className="pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleRunTest}
                disabled={isLoading}
                className="w-full text-xs font-bold shadow-[var(--shadow-xs)]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Analyzing Character...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="size-3.5 fill-primary-foreground" />
                    Test for Dyslexia (EfficientNet-B0)
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Box: Output & Diagnostics */}
        <Card className="flex flex-col h-full border border-border shadow-[var(--shadow-xs)]">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <CardTitle className="text-sm">2. Diagnostic Verdict &amp; Heatmap</CardTitle>
              </div>
              {result && (
                <Badge
                  variant={
                    result.prediction === "Reversal"
                      ? "destructive"
                      : result.prediction === "Corrected"
                      ? "warning"
                      : "success"
                  }
                  className="text-xs"
                >
                  {(result.confidence * 100).toFixed(1)}% Conf
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            {result ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={cn(
                      "p-3.5 rounded-lg border flex items-start gap-3",
                      result.prediction === "Reversal"
                        ? "border-destructive/40 bg-destructive/5 text-foreground"
                        : result.prediction === "Corrected"
                        ? "border-amber-500/40 bg-amber-500/5 text-foreground"
                        : "border-emerald-500/40 bg-emerald-500/5 text-foreground",
                    )}
                  >
                    {result.prediction === "Reversal" ? (
                      <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                    ) : result.prediction === "Corrected" ? (
                      <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold tracking-tight">
                        {result.prediction === "Reversal" && "DYSLEXIA RISK: LETTER REVERSAL DETECTED"}
                        {result.prediction === "Corrected" && "MOTOR HESITATION: OVERWRITTEN STROKES"}
                        {result.prediction === "Normal" && "NORMAL FORMATION: NO DYSLEXIA INDICATOR"}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.prediction === "Reversal" &&
                          `The character was formed with a mirrored horizontal orientation (e.g. left/right loop confusion).`}
                        {result.prediction === "Corrected" &&
                          `Multiple overwritten lines or hesitation tremors detected.`}
                        {result.prediction === "Normal" &&
                          `The character adheres to standard baseline geometry and stroke trajectory.`}
                      </p>
                    </div>
                  </div>

                  {/* 5-Step Segmented Probabilities */}
                  <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="label-mono text-[0.625rem] text-muted-foreground block">
                      3-Class Probability Dimensions:
                    </span>

                    {[
                      {
                        label: "Normal Formation",
                        prob: result.probabilities.Normal,
                        color: "bg-emerald-500",
                      },
                      {
                        label: "Letter Reversal (Dyslexia)",
                        prob: result.probabilities.Reversal,
                        color: "bg-destructive",
                      },
                      {
                        label: "Corrected / Overwritten",
                        prob: result.probabilities.Corrected,
                        color: "bg-amber-500",
                      },
                    ].map((item) => {
                      const score = getSegmentScore(item.prob);
                      return (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-muted-foreground text-[0.6875rem]">{item.label}</span>
                            <span className="font-bold text-foreground">
                              {(item.prob * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex w-full gap-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                              <div
                                key={step}
                                className={cn(
                                  "h-1.5 flex-1 rounded-xs border border-border transition-colors",
                                  step <= score ? item.color : "bg-muted/60",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Telemetry Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/30 border border-border">
                      <span className="label-mono text-[0.5625rem] text-muted-foreground block">Loop Vector</span>
                      <span className="label-mono text-xs font-bold text-foreground capitalize">
                        {result.features.loopOrientation}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-muted/30 border border-border">
                      <span className="label-mono text-[0.5625rem] text-muted-foreground block">Jitter Index</span>
                      <span className="label-mono text-xs font-bold text-foreground font-mono">
                        {result.features.jitterScore}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-muted/30 border border-border">
                      <span className="label-mono text-[0.5625rem] text-muted-foreground block">Ink Density</span>
                      <span className="label-mono text-xs font-bold text-foreground font-mono">
                        {result.features.inkDensity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation Box at Bottom */}
                <div className="p-3 rounded-lg border border-border bg-accent/20 dark:bg-accent/10 space-y-1 mt-auto">
                  <span className="eyebrow block">RECOMMENDED INTERVENTION</span>
                  <p className="text-xs text-foreground leading-relaxed font-mono">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-lg">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted border border-border text-muted-foreground mb-2.5">
                  <Layers className="size-5 opacity-60" />
                </div>
                <h3 className="label-mono text-xs font-semibold text-foreground mb-1">
                  Awaiting Assessment
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Draw or upload a character on the left panel, then click <strong>&quot;Test for Dyslexia&quot;</strong> to evaluate results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
