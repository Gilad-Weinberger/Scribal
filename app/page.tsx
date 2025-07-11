"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

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
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/auth/signup"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
