"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { FileUp } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-background/60 backdrop-blur-lg fixed top-0 z-50">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center">
          <FileUp className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            DropSync
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/receive">
              <Button variant="ghost">Receive Files</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}