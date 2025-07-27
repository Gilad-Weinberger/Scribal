"use client";
import React from "react";
import { DocumentsHeader } from "@/components/documents";
import { LayoutMain } from "@/components/ui";

const Page = () => {
  const handleSearch = (query: string) => {
    // Handle search functionality here
    console.log("Searching for:", query);
  };

  return (
    <LayoutMain>
      <DocumentsHeader onSearch={handleSearch} />
    </LayoutMain>
  );
};

export default Page;
