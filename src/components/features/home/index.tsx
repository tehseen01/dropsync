"use client";

import { useEffect, useState } from "react";
import { TFile } from "@/types";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import useStore from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QRCodeComponent from "@/components/shared/qr-code";

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [files, setFiles] = useState<TFile[]>([]);

  const supabase = createClient();
  const user = useStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChanges = async (payload: any) => {
    const newFile = payload.new;
    setFiles((prev) => [
      ...prev,
      {
        ...newFile,
      },
    ]);

    toast.success("New file received!", {
      description: `${newFile.name} has been uploaded to your session.`,
    });
  };

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`session-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "files",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => handleFileChanges(payload),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const copyLinkToClipboard = () => {
    if (!user) return;
    setIsLinkCopied(true);
    navigator.clipboard.writeText(
      `${window.location.origin}/upload/${user.id}`,
    );

    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const shareLink = async () => {
    if (!user) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "DropSync File Transfer",
          text: "Upload files to me using this link:",
          url: `${window.location.origin}/upload/${user.id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyLinkToClipboard();
    }
  };

  if (!mounted) return;

  return (
    <section className="flex items-center justify-center pt-8 max-md:px-2">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Scan this QR code to send files
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center px-0 pb-2">
          {user && <QRCodeComponent value={`/upload/${user.id}`} size={350} />}
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <div className="flex h-12 flex-1 items-center border p-2">
            <input
              className="w-full focus:border-none focus:outline-none"
              readOnly
              value={`${window.location.origin}/upload/${user?.id}`}
            />
          </div>
          <Button className="size-12" onClick={copyLinkToClipboard}>
            {isLinkCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
          {/* <Button
              variant="outline"
              onClick={shareLink}
              size={"lg"}
            >
              <Share2 className="size-5" />
            </Button> */}
        </CardFooter>
      </Card>
    </section>
  );
}
