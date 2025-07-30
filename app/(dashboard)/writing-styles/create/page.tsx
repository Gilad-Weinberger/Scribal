"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutNavbar } from "@/components/ui";
import CreateWritingStyleForm from "@/components/writing-styles/create/CreateWritingStyleForm";
import { clientHelpers } from "@/lib/functions/api-functions";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: {
    name: string;
    files: FileList | null;
  }) => {
    if (!user) {
      setError("You must be logged in to create a writing style");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await clientHelpers.processWritingStyleCreation(data);

      if (result.success && result.writingStyleId) {
        // Redirect to the writing styles page on success
        router.push("/writing-styles");
      } else {
        setError(result.error || "Failed to create writing style");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error creating writing style:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <LayoutNavbar>
        <CreateWritingStyleForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </LayoutNavbar>
    </ProtectedRoute>
  );
};

export default Page;
