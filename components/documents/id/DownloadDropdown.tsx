"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  DocumentDownloadIcon,
  FileTextIcon,
  FilePdfIcon,
  FileWordIcon,
} from "@/components/ui";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

interface DownloadDropdownProps {
  documentTitle: string;
  documentContent: string;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({
  documentTitle,
  documentContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadAsText = () => {
    const blob = new Blob([documentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const downloadAsPdf = async () => {
    try {
      const pdf = new jsPDF();

      // Split content into lines that fit the page width
      const splitText = pdf.splitTextToSize(documentContent, 180);

      // Add title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(documentTitle, 20, 20);

      // Add content
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(splitText, 20, 40);

      pdf.save(`${documentTitle}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Fallback to text download
      downloadAsText();
    }
    setIsOpen(false);
  };

  const downloadAsDocx = async () => {
    try {
      // Split content by line breaks and filter out empty lines
      const lines = documentContent
        .split("\n")
        .filter((line) => line.trim() !== "");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title paragraph
              new Paragraph({
                children: [
                  new TextRun({
                    text: documentTitle,
                    bold: true,
                    size: 32,
                    font: "Arial",
                  }),
                ],
              }),
              // Empty paragraph for spacing
              new Paragraph({
                children: [],
              }),
              // Content paragraphs - one for each line, with extra spacing
              ...lines.flatMap((line) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: 24,
                      font: "Arial",
                    }),
                  ],
                }),
                // Add an empty paragraph after each line for extra spacing
                new Paragraph({
                  children: [],
                }),
              ]),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentTitle}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      // Fallback to text download
      downloadAsText();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs cursor-pointer"
      >
        <DocumentDownloadIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-700 px-2 py-1 mb-1 border-b border-gray-100">
              Download as:
            </div>

            <button
              onClick={downloadAsText}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileTextIcon className="w-4 h-4 text-blue-600" />
              <span>Text (.txt)</span>
            </button>

            <button
              onClick={downloadAsPdf}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <FilePdfIcon className="w-4 h-4 text-red-600" />
              <span>PDF (.pdf)</span>
            </button>

            <button
              onClick={downloadAsDocx}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileWordIcon className="w-4 h-4 text-blue-700" />
              <span>Word (.docx)</span>
            </button>
          </div>
        </div>
      )}

      <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 whitespace-nowrap bg-background-secondary text-black border-2 border-border-light px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 text-xs z-10">
        Download
      </span>
    </div>
  );
};

export default DownloadDropdown;
