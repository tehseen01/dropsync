"use client";

import React, { useId, useMemo } from "react";
import { TFile } from "@/types";
import { Table } from "@tanstack/react-table";
import {
  CircleXIcon,
  Download,
  FilterIcon,
  LayoutGrid,
  List,
  ListFilterIcon,
  TrashIcon,
} from "lucide-react";

import { downloadFiles } from "@/lib/actions/file";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileDeleteDialog } from "@/components/shared";

interface TableToolbarProps {
  table: Table<TFile>;
  isGridView: boolean;
  setIsGridView: (isGridView: boolean) => void;
}

const TableToolbar = ({
  table,
  isGridView,
  setIsGridView,
}: TableToolbarProps) => {
  const id = useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("type");

    if (!statusColumn) return [];

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn("type")?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("type");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("type")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("type")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("type")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("type")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("type")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleDownload = async () => {
    const selectedFiles = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedFiles.length === 0) {
      alert("No files selected for download.");
      return;
    }
    try {
      const downloadedFiles = await downloadFiles(selectedFiles);
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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Filter by name or email */}
        <div className="relative">
          <Input
            id={`${id}-input`}
            ref={inputRef}
            className={cn(
              "peer min-w-60 ps-9",
              Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
            )}
            value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            placeholder="Filter by name or type..."
            type="text"
            aria-label="Filter by name or type"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <ListFilterIcon size={16} aria-hidden="true" />
          </div>
          {Boolean(table.getColumn("name")?.getFilterValue()) && (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear filter"
              onClick={() => {
                table.getColumn("name")?.setFilterValue("");
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              <CircleXIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        {/* Filter by status */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <FilterIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              File Type
              {selectedStatuses.length > 0 && (
                <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                  {selectedStatuses.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-36 p-3" align="start">
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-medium">
                Filters
              </div>
              <div className="space-y-3">
                {uniqueStatusValues.map((value, i) => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${id}-${i}`}
                      checked={selectedStatuses.includes(value)}
                      onCheckedChange={(checked: boolean) =>
                        handleStatusChange(checked, value)
                      }
                    />
                    <Label
                      htmlFor={`${id}-${i}`}
                      className="flex grow justify-between gap-2 font-normal"
                    >
                      {value}{" "}
                      <span className="text-muted-foreground ms-2 text-xs">
                        {statusCounts.get(value)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-3">
        {/* Delete button */}
        {table.getSelectedRowModel().rows.length > 0 && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                handleDownload();
              }}
            >
              <Download size={16} aria-hidden="true" />
              <span className="max-sm:hidden">Download</span>
              <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {table.getSelectedRowModel().rows.length}
              </span>
            </Button>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(true)}>
              <TrashIcon size={16} aria-hidden="true" />
              <span className="max-sm:hidden">Delete</span>
              <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {table.getSelectedRowModel().rows.length}
              </span>
            </Button>
          </>
        )}
        {/* List/grid view buttons */}
        <div className="flex items-center gap-2">
          <Button
            size={"icon"}
            variant={isGridView ? "outline" : "default"}
            onClick={() => setIsGridView(false)}
          >
            <List aria-hidden="true" />
          </Button>
          <Button
            variant={isGridView ? "default" : "outline"}
            size={"icon"}
            onClick={() => setIsGridView(true)}
          >
            <LayoutGrid aria-hidden="true" />
          </Button>
        </div>
      </div>
      {/* Delete file dialog */}
      <FileDeleteDialog
        isOpen={openDeleteDialog}
        handleOpenChange={setOpenDeleteDialog}
        files={
          table.getSelectedRowModel().rows.map((row) => row.original) || []
        }
      />
    </div>
  );
};

export default TableToolbar;
