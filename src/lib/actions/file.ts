"use server";

import { TFile } from "@/types";

import { createClient } from "../supabase/server";

interface FileUploadPayload {
  receiver_id: string;
  user_id: string;
  file: File;
}

const uploadFile = async ({
  receiver_id,
  user_id,
  file,
}: FileUploadPayload) => {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }
    if (!receiver_id || !user_id) {
      throw new Error("Receiver ID and User ID are required");
    }
    const supabase = await createClient();

    // Upload to Supabase storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("file_uploads")
      .upload(`${user_id}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;

    // Save file metadata to the database
    const { error: dbError, data: dbData } = await supabase
      .from("files")
      .insert({
        receiver_id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        user_id,
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

    return dbData;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw new Error("Failed to upload file", {
      cause: error,
    });
  }
};

const getCurrentUserFiles = async () => {
  const supabase = await createClient();
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      console.error("Error fetching user:", userError);
      return [];
    }

    const userId = user.user.id;

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .or(`receiver_id.eq.${userId},user_id.eq.${userId}`);

    if (!data || error) {
      console.error("Error fetching files:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error getCurrentUserFiles:", error);
    return [];
  }
};

const updateFiles = async (fileIds: string[], updates: Partial<TFile>) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .update(updates)
      .in("id", fileIds)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error updating file:", error);
    throw new Error("Failed to update file", {
      cause: error,
    });
  }
};

const deleteFiles = async (files: TFile[], userId: string) => {
  const supabase = await createClient();
  try {
    // First delete from storage

    const fileURLs = files.map(
      (file) => file.url.split("/public/file_uploads/")[1],
    );
    console.log("Deleting files from storage:", fileURLs);
    const fileIds = files.map((file) => file.id);
    const { error: storageError } = await supabase.storage
      .from("file_uploads")
      .remove(fileURLs); // Pass array directly, no need to join

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Then delete from database
    const { error: deleteError } = await supabase
      .from("files")
      .delete()
      .in("id", fileIds)
      .eq("user_id", userId);

    if (deleteError) {
      // If database deletion fails, we should log this as we've already deleted from storage
      console.error(
        "Database deletion failed after storage deletion:",
        deleteError,
      );
      throw new Error(deleteError.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw new Error("Failed to delete files", {
      cause: error,
    });
  }
};

const downloadFiles = async (files: TFile[]) => {
  const supabase = await createClient();

  try {
    // Process all files in parallel
    const downloadPromises = files.map(async (file) => {
      // Extract the file path from the URL
      const filePath = file.url.split("/public/file_uploads/")[1];

      if (!filePath) {
        console.warn(`Invalid file URL format: ${file.url}`);
        return null;
      }

      // Download the file
      const { data, error } = await supabase.storage
        .from("file_uploads")
        .download(filePath);

      if (error) {
        console.error(`Error downloading file ${filePath}:`, error);
        return null;
      }

      return {
        data,
        fileName: file.name || filePath.split("/").pop() || "download",
        originalFile: file,
      };
    });

    // Wait for all downloads to complete
    const results = await Promise.all(downloadPromises);

    // Filter out failed downloads and return successful ones
    return results.filter((result) => result !== null) as {
      data: Blob;
      fileName: string;
      originalFile: TFile;
    }[];
  } catch (error) {
    console.error("Error in download process:", error);
    return [];
  }
};

export {
  uploadFile,
  getCurrentUserFiles,
  updateFiles,
  deleteFiles,
  downloadFiles,
};
export type { FileUploadPayload };
