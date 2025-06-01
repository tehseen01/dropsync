"use client";

import { useEffect, useState } from "react";
import { TSession } from "@/types";
import { Copy, Download, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { generateSessionId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDisplay } from "@/components/file-display";
import QRCodeComponent from "@/components/qr-code";
import { ReceiveSessionInfo } from "@/components/receive-session-info";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

export default function ReceivePage() {
  const [newSession, setNewSession] = useState<TSession | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const supabase = createClient();

  const createNewSession = async () => {
    setLoading(true);
    try {
      const newSessionId = generateSessionId();

      // Create the session in Supabase
      const { data, error } = await supabase
        .from("sessions")
        .insert([
          {
            id: newSessionId,
            expires_at: new Date(
              Date.now() + 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ])
        .select();
      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from session creation");
      }

      // Create the upload URL
      const url = `${window.location.origin}/upload/${newSessionId}`;
      setNewSession({
        id: data[0].id,
        created_at: data[0].created_at,
        expires_at: data[0].expires_at,
        upload_url: url,
      });

      setFiles([]);

      toast.message("Session created!", {
        description: "Share the QR code with someone to receive files.",
      });
      return newSessionId; // Optional: return the session ID if needed
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Error creating session", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
      throw error; // Re-throw if you want calling code to handle it
    } finally {
      setLoading(false);
    }
  };

  // Generate a new Session when the component mounts
  useEffect(() => {
    createNewSession();
  }, []);

  const handleFileChanges = async (payload: any) => {
    console.log(payload);
    const newFile = payload.new;
    setFiles((prev) => [
      ...prev,
      {
        id: newFile.id,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        url: newFile.url,
        createdAt: newFile.created_at,
      },
    ]);

    toast.success("New file received!", {
      description: `${newFile.name} has been uploaded to your session.`,
    });
  };

  useEffect(() => {
    if (!newSession) return;

    const channel = supabase
      .channel(`session-${newSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "files",
          filter: `session_id=eq.${newSession.id}`,
        },
        (payload) => handleFileChanges(payload),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newSession]);

  const copyLinkToClipboard = () => {
    if (!newSession) return;

    navigator.clipboard.writeText(newSession.upload_url);
    toast.info("Link copied!", {
      description: "Share this link with the sender.",
    });
  };

  const shareLink = async () => {
    if (!newSession) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "DropSync File Transfer",
          text: "Upload files to me using this link:",
          url: newSession.upload_url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyLinkToClipboard();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-24 pb-16">
      <h1 className="mb-8 text-center text-3xl font-bold">Receive Files</h1>

      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="files">
            Received Files {files.length > 0 && `(${files.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qrcode" className="mt-0">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">
                Scan this QR code to send files
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-2">
              {newSession && (
                <>
                  <QRCodeComponent value={newSession.upload_url} size={280} />
                  <ReceiveSessionInfo session={newSession} />
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={copyLinkToClipboard}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={shareLink}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="default"
                className="w-full sm:w-auto"
                onClick={createNewSession}
                disabled={loading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                New Session
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-0">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Received Files</span>
                {files.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Clear All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No files received yet.
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Share your QR code with someone to receive files.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {files.map((file) => (
                    <FileDisplay key={file.id} file={file} />
                  ))}
                </div>
              )}
            </CardContent>
            {files.length > 0 && (
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
