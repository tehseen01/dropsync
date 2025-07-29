"use client";

import React from "react";
import { Forward } from "lucide-react";
import { useShallow } from "zustand/shallow";

import useStore from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FileTables from "./file-tables";

const FilesList = () => {
  const [isGridView, setIsGridView] = React.useState(true);

  const { user, files } = useStore(
    useShallow((state) => ({ user: state.user, files: state.files })),
  );

  const receivedFiles = files.filter(
    (file) => file.receiver_id === user?.id && !file.is_deleted,
  );
  const sharedFiles = files.filter((file) => file.user_id === user?.id);

  if (!files || files.length === 0) {
    return null;
  }

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
          <FileTables
            files={receivedFiles}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
          />
        </TabsContent>
        <TabsContent value="shared">
          <FileTables
            files={sharedFiles}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FilesList;
