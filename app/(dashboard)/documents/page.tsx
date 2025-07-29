"use client";
import { LayoutMain, SkeletonLoading } from "@/components/ui";
import { DocumentsHeader, DocumentsGrid } from "@/components/documents";
import { documentsAPI, writingStylesAPI } from "@/lib/api-functions";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { GeneratedDocument } from "@/lib/db-schemas";
import ModalNoExistingWritingStyle from "@/components/documents/ModalNoExistingWritingStyle";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Page = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNoWritingStyleModal, setShowNoWritingStyleModal] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const result = await documentsAPI.getAllDocuments();
        if (result.success && result.documents) {
          setDocuments(result.documents);
        } else if (result.success && result.generatedDocuments) {
          // Fallback for backward compatibility
          setDocuments(result.generatedDocuments);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user?.id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateDocument = async () => {
    try {
      const result = await writingStylesAPI.getAllWritingStyles();
      if (
        result.success &&
        result.writingStyles &&
        result.writingStyles.length > 0
      ) {
        // User has writing styles, navigate to create document page
        window.location.href = "/documents/create";
      } else {
        // User has no writing styles, show modal
        setShowNoWritingStyleModal(true);
      }
    } catch (error) {
      console.error("Error checking writing styles:", error);
      // Fallback to showing modal if there's an error
      setShowNoWritingStyleModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowNoWritingStyleModal(false);
  };

  return (
    <ProtectedRoute>
      <LayoutMain>
        <DocumentsHeader
          onSearch={handleSearch}
          onCreateDocument={handleCreateDocument}
        />
        {isLoading ? (
          <SkeletonLoading type="documents" />
        ) : (
          <DocumentsGrid documents={documents} searchQuery={searchQuery} />
        )}
        {showNoWritingStyleModal && (
          <ModalNoExistingWritingStyle onClose={handleCloseModal} />
        )}
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default Page;
