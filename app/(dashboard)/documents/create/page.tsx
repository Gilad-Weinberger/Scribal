"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutNavbar } from "@/components/ui";
import CreateDocumentForm from "@/components/documents/create/CreateDocumentForm";
import { clientHelpers, documentsAPI } from "@/lib/api-functions";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [warning, setWarning] = useState<string | undefined>();

  // Check writing styles when user is loaded
  useEffect(() => {
    if (user) {
      documentsAPI.checkWritingStyles().then((result) => {
        if (result.warning) {
          setWarning(result.warning);
        }
      });
    }
  }, [user]);

  const handleSubmit = async (data: {
    title: string;
    prompt: string;
    requirements?: string;
    writingStyleId?: string;
  }) => {
    if (!user) {
      setError("You must be logged in to create a document");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await clientHelpers.processDocumentCreation(data);

      if (result.success && result.documentId) {
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push("/documents");
        }, 1000);
      } else {
        setError(result.error || "Failed to create document");
      }
    } catch (err) {
      console.error("Error creating document:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <LayoutNavbar>
        <CreateDocumentForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          warning={warning}
          userId={user?.id}
        />
      </LayoutNavbar>
    </ProtectedRoute>
  );
};

export default Page;
