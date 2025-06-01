"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBytes, getFileTypeIcon } from "@/lib/utils";
import { FileWarning, CheckCircle } from "lucide-react";

interface FilePreviewProps {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function FilePreview({ file, progress, status, error }: FilePreviewProps) {
  const fileIcon = getFileTypeIcon(file.type);
  
  return (
    <Card className={`
      p-4 flex items-center gap-3 relative border 
      ${status === 'success' ? 'border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/10' : ''}
      ${status === 'error' ? 'border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}
    `}>
      <div className="text-2xl">{fileIcon}</div>
      
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatBytes(file.size)}</span>
          {status === 'error' && (
            <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
              <FileWarning className="h-3 w-3" /> {error || 'Upload failed'}
            </span>
          )}
        </div>
      </div>
      
      {status === 'uploading' && (
        <div className="ml-auto w-20 text-right">
          <span className="text-xs font-medium">{progress}%</span>
          <Progress value={progress} className="h-1.5 mt-1" />
        </div>
      )}
      
      {status === 'success' && (
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" />
      )}
    </Card>
  );
}