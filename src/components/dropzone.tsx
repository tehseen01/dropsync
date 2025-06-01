"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  disabled?: boolean;
}

export function Dropzone({ onFilesDrop, disabled = false }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;
      onFilesDrop(acceptedFiles);
    },
    [onFilesDrop, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer flex flex-col items-center justify-center",
        isDragActive
          ? "border-primary/70 bg-primary/5"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed hover:border-muted-foreground/30 hover:bg-transparent"
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <UploadCloud
            className={cn(
              "h-10 w-10",
              isDragActive && "animate-bounce"
            )}
          />
        </div>
        
        <div className="space-y-1">
          <p className="font-medium text-lg">
            {isDragActive ? "Drop the files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse your files
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum file size: 50MB
          </p>
        </div>
      </div>
    </div>
  );
}