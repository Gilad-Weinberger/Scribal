"use client";

import React from "react";
import { GeneratedDocument } from "@/lib/db-schemas";
import { DocumentCard, EmptyDocuments } from "./DocumentsGrid/index";

interface DocumentsGridProps {
  documents: GeneratedDocument[];
  searchQuery?: string;
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  searchQuery = "",
}) => {
  const filteredDocuments = documents.filter((document) =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredDocuments.length === 0) {
    return <EmptyDocuments searchQuery={searchQuery} />;
  } 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-42">
      {filteredDocuments.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};

export default DocumentsGrid;
