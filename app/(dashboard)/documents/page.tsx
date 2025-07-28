"use client";
import { LayoutMain, SkeletonLoading } from "@/components/ui";
import { DocumentsHeader, DocumentsGrid } from "@/components/documents";
import { documentsAPI } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { GeneratedDocument } from "@/lib/db-schemas";

const Page = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const result = await documentsAPI.getAllDocuments();
        if (result.success && result.documents) {
          setDocuments(result.documents);
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

  return (
    <LayoutMain>
      <DocumentsHeader onSearch={handleSearch} />
      {isLoading ? (
        <SkeletonLoading type="documents" />
      ) : (
        <DocumentsGrid documents={documents} searchQuery={searchQuery} />
      )}
    </LayoutMain>
  );
};

export default Page;
