"use client";

import React from "react";
import { TFile } from "@/types";
import { CircleAlertIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

import { deleteFiles, updateFiles } from "@/lib/actions/file";
import useStore from "@/lib/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface FileDeleteDialogProps {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  files: TFile[];
}

export const FileDeleteDialog = ({
  files,
  isOpen,
  handleOpenChange,
}: FileDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { user, setFiles, storedFiles } = useStore(
    useShallow((state) => ({
      user: state.user,
      storedFiles: state.files,
      setFiles: state.setFiles,
    })),
  );

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);

    try {
      // Separate files by ownership
      const receiverFiles = files.filter(
        (file) => file.receiver_id === user.id,
      );
      const ownerFiles = files.filter((file) => file.user_id === user.id);
      // Process receiver files (soft delete)
      if (receiverFiles.length > 0) {
        await updateFiles(
          receiverFiles.map((file) => file.id),
          {
            is_deleted: true,
          },
        );

        const updatedFiles = storedFiles.filter(
          (file) => !receiverFiles.some((f) => f.id === file.id),
        );
        setFiles(updatedFiles);
      }
      // If the user is deleting their own files, we hard delete them
      // Process owner files (hard delete)
      if (ownerFiles.length > 0) {
        await deleteFiles(ownerFiles, user.id);

        const filteredFiles = storedFiles.filter(
          (file) => !ownerFiles.some((f) => f.id === file.id),
        );
        setFiles(filteredFiles);
      }

      toast.success("Files deleted successfully");
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete files. Please try again later.",
      );
    } finally {
      setIsDeleting(false);
      handleOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {files.length} selected {files.length === 1 ? "row" : "rows"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
