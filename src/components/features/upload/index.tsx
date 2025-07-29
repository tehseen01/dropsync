"use client";

import {
  AlertCircleIcon,
  Check,
  FileIcon,
  Loader2,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { cn, formatBytes } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/shared";

interface fileUploadProps {
  receiverId: string;
}
export default function FileUpload({ receiverId }: fileUploadProps) {
  const maxSizeMB = 50;
  const maxSize = maxSizeMB * 1024 * 1024; // 50MB default
  const maxFiles = 10; // Default max files

  const [
    { files, isDragging, errors, isUploading },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
      uploadFiles,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    receiverId,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-80 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        {files.length > 0 ? (
          <div className="flex h-full w-full flex-1 flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex-1 truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <Button
                variant="outline"
                onClick={openFileDialog}
                disabled={isUploading}
              >
                <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                Add more
              </Button>
              <Button
                variant="destructive"
                onClick={clearFiles}
                disabled={isUploading}
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove all
              </Button>
            </div>
            <div className="w-full space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3 transition-opacity",
                    file.status === "error" && "border-red-500 bg-red-50",
                    file.status === "success" &&
                      "animate-fade-down animate-once animate-reverse animate-duration-500 border-green-500 bg-green-50",
                    file.status === "uploading" && "border-blue-500 bg-blue-50",
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FilePreview file={file.file} />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-[13px] font-medium">
                        {file.file instanceof File
                          ? file.file.name
                          : file.file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(
                          file.file instanceof File
                            ? file.file.size
                            : file.file.size,
                        )}
                      </p>
                    </div>
                  </div>

                  {file.status === "success" ? (
                    <Check className="size-4 text-green-500" />
                  ) : file.status === "error" ? (
                    <AlertCircleIcon className="size-4 text-red-500" />
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                      onClick={() => removeFile(file.id)}
                      aria-label="Remove file"
                      disabled={isUploading}
                    >
                      {file.status === "uploading" ? (
                        <Loader2 className="size-4 animate-spin text-blue-500" />
                      ) : (
                        <XIcon className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <Button
                variant={"default"}
                className="w-full"
                size={"lg"}
                onClick={uploadFiles}
                disabled={isUploading || files.length === 0}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <FileIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload files</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select files
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
