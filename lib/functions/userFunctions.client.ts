"use client";

import { User, UserRow, dbRowToUser } from "../db-schemas";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const subscribeToUserDocument = (
  uid: string,
  callback: (user: User | null) => void
): (() => void) => {
  // This function must run on the client.
  const supabase = createClient();
  const subscription = supabase
    .channel(`user_${uid}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
        filter: `id=eq.${uid}`,
      },
      (payload: RealtimePostgresChangesPayload<UserRow>) => {
        if (payload.new) {
          callback(dbRowToUser(payload.new as UserRow));
        } else {
          callback(null);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  if (!file) {
    return { url: null, error: "No file provided." };
  }

  const supabase = createClient();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExtension}`;
  const filePath = `profile-pictures/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("scribal-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return {
      url: null,
      error: uploadError.message || "Failed to upload profile picture.",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("scribal-bucket").getPublicUrl(filePath);

  return { url: publicUrl, error: null };
};
