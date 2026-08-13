"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Check, X } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUploadZone({ onFileSelect, disabled = false }: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WEBP).");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="label-mono text-xs text-foreground">
          Upload Worksheet Scan / Image
        </span>
        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={removeFile}
            className="text-destructive hover:text-destructive"
          >
            <X className="size-3 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-[280px] rounded-lg border-2 border-dashed transition-all cursor-pointer p-6 text-center ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border bg-card/60 hover:border-foreground/40 hover:bg-muted/40"
          }`}
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted border border-border text-foreground mb-2.5 shadow-[var(--shadow-2xs)]">
            <UploadCloud className="size-5" />
          </div>
          <p className="label-mono text-xs text-foreground">
            Drop image here or <span className="text-primary underline">browse</span>
          </p>
          <p className="text-[0.6875rem] text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Supports PNG, JPEG, WEBP homework scans (up to 10MB)
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center h-[280px] rounded-lg border border-border bg-card p-4 overflow-hidden">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Uploaded scan preview"
              className="max-h-[210px] w-auto object-contain rounded border border-border shadow-[var(--shadow-2xs)]"
            />
          )}
          <div className="flex items-center gap-1.5 mt-2.5 label-mono text-[0.6875rem] text-foreground">
            <Check className="size-3 text-emerald-500" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <span className="text-muted-foreground">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadZone;
