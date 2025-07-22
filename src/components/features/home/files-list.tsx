"use client";

import React from "react";
import { TFile } from "@/types";
import { Forward } from "lucide-react";

import useStore from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FileTables from "./file-tables";

interface FileListProps {
  files: TFile[];
}

const FilesList = ({ files }: FileListProps) => {
  const user = useStore((state) => state.user);

  const receivedFiles = files.filter((file) => file.receiver_id === user?.id);
  const sharedFiles = files.filter((file) => file.user_id === user?.id);

  return (
    <section className="container mx-auto mt-14 px-2 md:px-4">
      <Tabs defaultValue="received" className="w-full">
        <ScrollArea>
          <TabsList className="mb-3 h-11">
            <TabsTrigger value="received" className="group">
              <Forward
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Received Files
              <Badge
                className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {(receivedFiles && receivedFiles.length) || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="shared" className="group">
              <Forward
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Shared Files
              <Badge
                className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {(sharedFiles && sharedFiles.length) || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="received">
          <FileTables files={receivedFiles} />
        </TabsContent>
        <TabsContent value="shared">
          <FileTables files={sharedFiles} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FilesList;
