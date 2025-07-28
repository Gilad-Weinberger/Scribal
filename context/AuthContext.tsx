"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { User as AppUser } from "@/lib/db-schemas";
import useRealtimeUser from "@/lib/hooks/useRealtimeUser";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  // Initial session fetch effect
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setSessionLoading(false);
      }
    };

    getInitialSession();
  }, [supabase]);

  // Auth state change effect (session)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Realtime user hook
  const { user, isLoading: userLoading } = useRealtimeUser(
    session?.user?.id || null
  );

  console.log("user", user);

  // Combined loading state - only consider loading if we have a session but user is still loading
  const isLoading = sessionLoading || (!!session && userLoading);

  useEffect(() => {
    if (isLoading || onboardingCompleted) return;

    const isAuthPage = pathname.startsWith("/auth");
    const isHomePage = pathname === "/";
    const isOnboardingPage = pathname.startsWith("/onboarding");

    // Only redirect if there's no session AND we're not on an allowed page
    if (!session && !isAuthPage && !isHomePage && !isOnboardingPage) {
      router.push("/auth/signin");
    }
  }, [session, isLoading, pathname, router, onboardingCompleted]);

  useEffect(() => {
    if (!isLoading && user) {
      const isOnboardingPage = pathname.startsWith("/onboarding");
      const missingFields: string[] = [];

      if (!user.displayName) {
        missingFields.push("displayName");
      }
      if (!user.university || !user.major) {
        missingFields.push("academicInfo");
      }
      if (!user.profilePictureUrl) {
        missingFields.push("profilePicture");
      }

      if (missingFields.length > 0 && !isOnboardingPage) {
        const queryString = new URLSearchParams({
          missing: missingFields.join(","),
        }).toString();
        router.push(`/onboarding?${queryString}`);
      }
    }
  }, [user, isLoading, pathname, router, onboardingCompleted]);

  return (
    <AuthContext.Provider value={{ user, isLoading, completeOnboarding }}>
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
