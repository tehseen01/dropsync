"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileCheck, FileIcon, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dropzone } from "@/components/dropzone";
import { FilePreview } from "@/components/file-preview";

interface FileToUpload {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function UploadPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [files, setFiles] = useState<FileToUpload[]>([]);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkSessionValidity() {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("id, expires_at")
          .eq("id", sessionId)
          .single();

        if (error || !data) {
          setSessionValid(false);
          return;
        }

        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
          setSessionValid(false);
        } else {
          setSessionValid(true);
        }
      } catch (error) {
        console.error("Error checking session validity:", error);
        setSessionValid(false);
      }
    }

    if (sessionId) {
      checkSessionValidity();
    }
  }, [sessionId, supabase]);

  const handleFilesDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter files larger than 50MB
      const MAX_SIZE = 50 * 1024 * 1024; // 50MB

      const validFiles = acceptedFiles.filter((file) => file.size <= MAX_SIZE);
      const tooLargeFiles = acceptedFiles.filter(
        (file) => file.size > MAX_SIZE,
      );

      if (tooLargeFiles.length > 0) {
        toast.warning("files too large", {
          description: `${tooLargeFiles.length} file(s) exceed the 50MB limit.`,
        });
      }

      const newFiles = validFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [toast],
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const pendingFiles = files.filter((f) => f.status === "pending");

    try {
      for (const fileObj of pendingFiles) {
        try {
          // Update file status to uploading
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: "uploading" as const } : f,
            ),
          );

          // Upload to Supabase storage
          const fileName = `${Date.now()}-${fileObj.file.name}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("file_uploads")
              .upload(`${sessionId}/${fileName}`, fileObj.file, {
                cacheControl: "3600",
                upsert: false,
              });

          if (uploadError) throw uploadError;

          // Get the file URL
          const { data: urlData } = await supabase.storage
            .from("file_uploads")
            .getPublicUrl(`${sessionId}/${fileName}`);

          // Save file metadata to the database
          const { error: dbError } = await supabase.from("files").insert({
            session_id: sessionId,
            name: fileObj.file.name,
            size: fileObj.file.size,
            type: fileObj.file.type,
            url: urlData.publicUrl,
          });

          if (dbError) throw dbError;

          // Update file status to success
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: "success" as const, progress: 100 }
                : f,
            ),
          );
        } catch (error) {
          console.error("Error uploading file:", error);

          // Update file status to error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error" as const,
                    error: "Failed to upload file",
                  }
                : f,
            ),
          );
        }
      }

      // Show success toast if at least one file was uploaded successfully
      if (files.some((f) => f.status === "success")) {
        toast.success("Files uploaded successfully", {
          description: "The recipient can now access your files.",
        });
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      toast.error("Upload failed", {
        description: "There was an error uploading your files.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (sessionValid === null) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Checking session...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Progress value={75} className="w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionValid === false) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              Invalid or Expired Session
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p>
              This upload link is no longer valid. Please ask for a new QR code
              from the recipient.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/")}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalBytes = files.reduce((total, file) => total + file.file.size, 0);
  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-center">
            <FileIcon className="h-6 w-6" />
            <span>Upload Files to Session #{sessionId}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dropzone onFilesDrop={handleFilesDrop} disabled={isUploading} />

          {files.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Files to Upload ({files.length})
                </h3>
                <div className="text-muted-foreground text-sm">
                  Total Size: {formatBytes(totalBytes)}
                </div>
              </div>

              <div className="max-h-[40vh] space-y-3 overflow-y-auto pr-2">
                {files.map((fileObj) => (
                  <div key={fileObj.id} className="relative">
                    <FilePreview
                      file={fileObj.file}
                      progress={fileObj.progress}
                      status={fileObj.status}
                      error={fileObj.error}
                    />
                    {fileObj.status !== "uploading" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-8 w-8"
                        onClick={() => removeFile(fileObj.id)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {(successCount > 0 || errorCount > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {successCount > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      <FileCheck className="h-4 w-4" />
                      {successCount} file(s) uploaded
                    </div>
                  )}
                  {errorCount > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      <X className="h-4 w-4" />
                      {errorCount} file(s) failed
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {files.length > 0 && pendingCount > 0 && (
          <CardFooter>
            <Button
              onClick={uploadFiles}
              disabled={isUploading || pendingCount === 0}
              className="w-full"
            >
              <UploadCloud
                className={`mr-2 h-5 w-5 ${isUploading ? "animate-bounce" : ""}`}
              />
              {isUploading
                ? "Uploading..."
                : `Upload ${pendingCount} File${pendingCount !== 1 ? "s" : ""}`}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
