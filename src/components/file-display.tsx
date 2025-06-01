"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBytes, getFileTypeIcon } from "@/lib/utils";
import { Download, Eye, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export function FileDisplay({ file }: FileProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileIcon = getFileTypeIcon(file.type);
  const isPreviewable = file.type.startsWith("image/") || file.type === "application/pdf";

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="text-4xl mr-4">{fileIcon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              {isPreviewable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" asChild>
                <a href={file.url} download={file.name}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isPreviewable && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-screen-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span className="truncate">{file.name}</span>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Original
                  </a>
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto min-h-0 mt-4">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full h-auto max-h-[70vh] mx-auto object-contain"
                />
              ) : file.type === "application/pdf" ? (
                <iframe
                  src={`${file.url}#toolbar=0`}
                  className="w-full h-[70vh]"
                  title={file.name}
                />
              ) : (
                <div className="text-center py-12">
                  <p>Preview not available for this file type.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}