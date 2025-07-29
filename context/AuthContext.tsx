"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { User as AppUser, dbRowToUser } from "@/lib/db-schemas";
import useRealtimeUser from "@/lib/hooks/useRealtimeUser";

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialDbUser, setInitialDbUser] = useState<AppUser | null>(null);
  const [dbUserLoading, setDbUserLoading] = useState(false);

  // Initial user fetch effect
  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setAuthUser(user);
      } catch (error) {
        console.error("Error fetching initial user:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    getInitialUser();
  }, [supabase]);

  // Auth state change effect
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthUser(session?.user || null);
      setAuthLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Fetch initial database user when supabase user is available
  useEffect(() => {
    if (!authUser?.id) {
      setInitialDbUser(null);
      setDbUserLoading(false);
      return;
    }

    setDbUserLoading(true);

    const fetchDbUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) {
          console.error("Error fetching database user:", error);
          setInitialDbUser(null);
        } else if (data) {
          setInitialDbUser(dbRowToUser(data));
        } else {
          setInitialDbUser(null);
        }
      } catch (error) {
        console.error("Error fetching database user:", error);
        setInitialDbUser(null);
      } finally {
        setDbUserLoading(false);
      }
    };

    fetchDbUser();
  }, [authUser?.id, supabase]);

  // Use realtime user hook for updates, with initial user from AuthContext
  const { user: realtimeUser } = useRealtimeUser(
    authUser?.id || null,
    initialDbUser
  );

  // Use realtime user if available, otherwise use initial user
  const user = realtimeUser || initialDbUser;

  // Combined loading state - keep loading until we have definitive user state
  const isLoading =
    authLoading || dbUserLoading || (authUser !== null && !user);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
