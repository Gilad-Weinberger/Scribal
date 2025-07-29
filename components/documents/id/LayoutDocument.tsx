import React from "react";
import Navbar from "../../ui/Navbar";
import Sidebar from "../../ui/Sidebar";
import { GeneratedDocument } from "@/lib/db-schemas";
import DocumentSidebar from "@/components/documents/id/DocumentSidebar";

interface LayoutDocumentProps {
  children: React.ReactNode;
  document: GeneratedDocument;
}

export default function LayoutDocument({
  children,
  document,
}: Readonly<LayoutDocumentProps>) {
  return (
    <div className="min-h-screen overflow-hidden bg-background-secondary">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 pt-12 pl-14 min-w-full bg-background-secondary">
          <DocumentSidebar document={document} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
