"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutNavbar } from "@/components/ui";
import CreateDocumentForm from "@/components/documents/create/CreateDocumentForm";
import { clientHelpers, documentsAPI } from "@/lib/api-functions";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [warning, setWarning] = useState<string | undefined>();

  // Check writing styles when user is loaded
  useEffect(() => {
    if (user && !authLoading) {
      documentsAPI.checkWritingStyles().then((result) => {
        if (result.warning) {
          setWarning(result.warning);
        }
      });
    }
  }, [user, authLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <LayoutNavbar>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-text-secondary">Loading...</p>
          </div>
        </div>
      </LayoutNavbar>
    );
  }

  // Show message if not authenticated
  if (!user) {
    return (
      <LayoutNavbar>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium">Authentication Required</p>
            <p className="text-sm text-text-secondary mt-1">
              Please sign in to create documents
            </p>
          </div>
        </div>
      </LayoutNavbar>
    );
  }

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
    <LayoutNavbar>
      <CreateDocumentForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        warning={warning}
        userId={user?.id}
      />
    </LayoutNavbar>
  );
};

export default Page;
