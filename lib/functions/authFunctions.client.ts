"use client";

import { Session } from "@supabase/supabase-js";
import { ensureUserDocument } from "./userFunctions";
import { User } from "../db-schemas";

export const handleAuthStateChange = async (
  session: Session | null
): Promise<User | null> => {
  if (session?.user) {
    const { user: authUser } = session;
    const userData = {
      email: authUser.email ?? null,
      phoneNumber: authUser.phone ?? null,
      displayName: authUser.user_metadata?.display_name ?? null,
    };

    const result = await ensureUserDocument(authUser.id, userData);

    if (result.success && result.user) {
      return result.user;
    } else {
      console.error("Failed to ensure user document:", result.error);
      return null;
    }
  }
  return null;
};
