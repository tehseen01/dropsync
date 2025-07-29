"use client";

import React from "react";
import { TFile } from "@/types";
import { Table } from "@tanstack/react-table";
import { Download, FileIcon, Trash } from "lucide-react";

import { downloadFiles } from "@/lib/actions/file";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDeleteDialog } from "@/components/shared";

interface FileCardProps {
  table: Table<TFile>;
}

const FileCard = ({ table }: FileCardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDownload = async (file: TFile) => {
    try {
      const downloadedFiles = await downloadFiles([file]);
      if (downloadedFiles.length === 0) {
        alert("No files could be downloaded.");
        return;
      }

      downloadedFiles.forEach(({ data, fileName }) => {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error downloading files:", error);
      alert("An error occurred while downloading files.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          const file = row.original;
          return (
            <div
              key={row.id}
              className="group hover:bg-accent relative rounded-lg border transition-colors"
              onClick={() => row.toggleSelected()}
            >
              <div className="flex flex-col items-center gap-2">
                {/* File thumbnail */}
                {file.type.startsWith("image/") ? (
                  <div className="bg-muted aspect-square overflow-hidden rounded-md">
                    <img
                      src={file.url} // or your file URL
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex aspect-square h-full w-full flex-col items-center justify-center rounded-md">
                    <FileIcon className="text-muted-foreground h-12 w-12" />
                    <span className="truncate">{file.type}</span>
                  </div>
                )}

                {/* File info */}
                <div
                  className={cn(
                    "absolute inset-0 flex w-full flex-col gap-1 rounded-md bg-black/15 p-2 text-white transition-opacity group-hover:bg-black/30",
                    row.getIsSelected() && "bg-black/30",
                  )}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      className="size-8 p-1"
                      variant={"destructive"}
                      size={"icon"}
                      onClick={(e) => {
                        e.stopPropagation();

                        row.toggleSelected();
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Trash />
                    </Button>
                    <Button
                      className="size-8 p-1"
                      size={"icon"}
                      variant={"secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(row.original);
                      }}
                    >
                      <Download />
                    </Button>
                  </div>
                  <p className="mt-auto w-full truncate text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs opacity-90">{formatBytes(file.size)}</p>
                </div>

                {/* Selection indicator */}
                <div className="absolute top-2 left-2 p-1">
                  <Checkbox checked={row.getIsSelected()} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full flex h-24 items-center justify-center">
          <p className="text-muted-foreground">No files found</p>
        </div>
      )}
      <FileDeleteDialog
        isOpen={openDeleteDialog}
        handleOpenChange={setOpenDeleteDialog}
        files={table.getSelectedRowModel().rows.map((row) => row.original)}
      />
    </div>
  );
};

export default FileCard;
