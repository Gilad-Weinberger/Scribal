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
import { handleAuthStateChange } from "@/lib/functions/authFunctions.client";
import { subscribeToUserDocument } from "@/lib/functions/userFunctions.client";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  isLoading: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsLoading(true);
      const user = await handleAuthStateChange(session);
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (isLoading || onboardingCompleted) return;

    const isAuthPage = pathname.startsWith("/auth");
    const isHomePage = pathname === "/";
    const isOnboardingPage = pathname.startsWith("/onboarding");

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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (session?.user?.id) {
      unsubscribe = subscribeToUserDocument(
        session.user.id,
        (updatedUser: AppUser | null) => {
          setUser(updatedUser);
        }
      );
    }
    return () => {
      unsubscribe?.();
    };
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, user, isLoading, completeOnboarding }}
    >
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
