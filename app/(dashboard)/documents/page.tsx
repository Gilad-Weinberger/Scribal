"use client";
import React, { useState } from "react";
import { DocumentsHeader } from "@/components/documents";
import { LayoutMain, SkeletonLoading } from "@/components/ui";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false); // This would be true when fetching documents

  const handleSearch = (query: string) => {
    // Handle search functionality here
    console.log("Searching for:", query);
  };

  return (
    <LayoutMain>
      <DocumentsHeader onSearch={handleSearch} />
      {isLoading ? (
        <SkeletonLoading type="documents" />
      ) : (
        <div className="px-42">
          {/* Documents grid would go here */}
          <div className="text-center text-gray-500 py-8">
            Documents grid will be implemented here
          </div>
        </div>
      )}
    </LayoutMain>
  );
};

export default Page;
