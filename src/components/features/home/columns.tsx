"use client";

import { TFile } from "@/types";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import { EllipsisIcon, ExternalLink } from "lucide-react";

import { cn, formatBytes } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePreview } from "@/components/shared";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<TFile> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.type}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<TFile> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const columns: ColumnDef<TFile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        <div className="flex-shrink-0">
          <FilePreview file={row.original} />
        </div>
        <span className="truncate">{row.getValue("name")}</span>
      </div>
    ),
    size: 220,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "File URL",
    accessorKey: "url",
    cell: ({ row }) => {
      const url = row.original.url;
      if (!url) return "N/A";
      return (
        <div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            View File <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      );
    },
    size: 100,
  },
  {
    header: "File Type",
    accessorKey: "type",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("type") === "Inactive" &&
            "bg-muted-foreground/60 text-primary-foreground",
        )}
      >
        {row.getValue("type")}
      </Badge>
    ),
    size: 100,
    filterFn: statusFilterFn,
  },
  {
    header: "File Size",
    accessorKey: "size",
    cell: ({ row }) => {
      const size = parseFloat(row.getValue("size"));
      const formatted = formatBytes(size);
      if (!formatted) return "N/A";
      return formatted;
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

function RowActions({ row }: { row: Row<TFile> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Move to project</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced options</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Add to favorites</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
