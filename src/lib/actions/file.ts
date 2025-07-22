"use server";

import { createClient } from "@/lib/supabase/server";

interface FileUploadPayload {
  receiver_id: string;
  user_id: string;
  file: File;
}

export const uploadFile = async ({
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
