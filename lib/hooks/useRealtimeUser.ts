import { useEffect, useState } from "react";
import { User } from "@/lib/db-schemas";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { UserRow, dbRowToUser } from "@/lib/db-schemas";
import { createClient } from "@/lib/supabase/client";

const subscribeToUserDocument = (
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

const useRealtimeUser = (userId: string | null, initialUser: User | null) => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    // Set initial user if provided
    if (initialUser) {
      setUser(initialUser);
    }

    // Subscribe to real-time changes
    const unsubscribe = subscribeToUserDocument(userId, (updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, initialUser]);

  return { user };
};

export default useRealtimeUser;
