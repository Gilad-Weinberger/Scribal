import { useEffect, useState } from "react";
import { User } from "@/lib/db-schemas";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { UserRow } from "@/lib/db-schemas";
import { dbRowToUser } from "@/lib/db-schemas";
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

const useRealtimeUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // First, fetch the initial user data
    const fetchInitialUser = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        } else if (data) {
          // Import the conversion function
          const { dbRowToUser } = await import("@/lib/db-schemas");
          setUser(dbRowToUser(data));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching initial user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch initial data
    fetchInitialUser();

    // Then subscribe to real-time changes
    const unsubscribe = subscribeToUserDocument(userId, (updatedUser) => {
      setUser(updatedUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { user, isLoading };
};

export default useRealtimeUser;
