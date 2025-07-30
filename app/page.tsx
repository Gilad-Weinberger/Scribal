"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/lib/functions/api-functions";

export default function Home() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Scribal
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your AI-powered writing assistant that actually knows you.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {user ? (
            <>
              <Link
                href="/documents"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-offset-2 focus-visible:outline-primary-focus transition-colors"
              >
                Go to Documents
              </Link>
              <button
                type="button"
                className="rounded-md bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-colors"
                onClick={handleSignOut}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/signup"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-offset-2 focus-visible:outline-primary-focus transition-colors"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
