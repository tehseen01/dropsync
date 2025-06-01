"use client";

import { useEffect, useState } from "react";
import { TSession } from "@/types";
import { InfoIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReceiveSessionInfoProps {
  session: TSession;
}

export function ReceiveSessionInfo({ session }: ReceiveSessionInfoProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!session?.expires_at) {
      setTimeLeft("Invalid session");
      return;
    }

    const calculateTimeLeft = () => {
      try {
        const expiryTime = new Date(session.expires_at);
        const now = new Date();
        const difference = expiryTime.getTime() - now.getTime();

        if (difference <= 0) return "Expired";

        // Calculate total hours and minutes remaining
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);

        // Format based on remaining time
        if (totalHours >= 24) {
          const days = Math.floor(totalHours / 24);
          const remainingHours = totalHours % 24;
          return `${days}d ${remainingHours}h`;
        }

        return `${totalHours}h ${minutes}m`;
      } catch (error) {
        console.error("Error calculating time left:", error);
        return "Error";
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every minute (60000ms)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [session?.expires_at]); // Only re-run if expires_at changes

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <Badge variant="outline" className="px-2 py-1 text-xs">
        ID: {session.id}
      </Badge>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <InfoIcon className="h-3 w-3" />
              Expires in {timeLeft}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This session will expire in {timeLeft}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
