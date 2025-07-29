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

    // Add a timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn("Document creation is taking longer than expected...");
      setError(
        "Document creation is taking longer than expected. Please try again."
      );
      setIsLoading(false);
    }, 30000); // 30 second timeout

    try {
      console.log("Starting document creation...", data);
      const result = await clientHelpers.processDocumentCreation(data);
      console.log("Document creation result:", result);

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (result.success && result.documentId) {
        console.log(
          "Attempting to navigate to:",
          `/documents/${result.documentId}`
        );
        // Add a small delay to ensure the user sees the completion
        setTimeout(() => {
          try {
            router.push(`/documents/${result.documentId}`);

            // Fallback navigation in case router.push fails
            setTimeout(() => {
              if (window.location.pathname === "/documents/create") {
                console.warn(
                  "Router navigation may have failed, using window.location"
                );
                window.location.href = `/documents/${result.documentId}`;
              }
            }, 2000);
          } catch (navError) {
            console.error("Navigation error:", navError);
            window.location.href = `/documents/${result.documentId}`;
          }
        }, 1000);
      } else {
        console.error("Document creation failed:", result.error);
        setError(result.error || "Failed to create document");
        setIsLoading(false);
      }
    } catch (err) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId);
      console.error("Error creating document:", err);
      setError("An unexpected error occurred. Please try again.");
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
