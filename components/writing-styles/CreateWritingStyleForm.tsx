"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CreateWritingStyleFormProps {
  onSubmit?: (data: { name: string; files: FileList | null }) => void;
}

const CreateWritingStyleForm: React.FC<CreateWritingStyleFormProps> = ({
  onSubmit,
}) => {
  const [writingStyleName, setWritingStyleName] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleCreateWritingStyle = () => {
    onSubmit?.({ name: writingStyleName, files });
    console.log("create new writing style");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <div className="flex justify-center w-full py-10">
      <div className="w-160 border-2 border-border-default rounded-lg">
        <div className="p-4 border-b-2 border-border-default">
          <p className="text-lg font-medium">Create a new writing style</p>
          <p className="mt-1 text-sm text-text-secondary">
            Your writing style is the way you write. It is the way you express
            yourself. We create a special AI model that will write just like
            you.
          </p>
        </div>
        <div className="p-4 flex justify-between border-b-2 border-border-default">
          <p className="text-sm font-medium">Writing Style Name</p>
          <input
            type="text"
            placeholder="Enter your writing style name"
            className="w-[60%] px-3 py-2 border-2 border-border-default rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 focus:ring-text-medium bg-background-input text-sm"
            value={writingStyleName}
            onChange={(e) => setWritingStyleName(e.target.value)}
          />
        </div>
        <div className="p-4 border-b-2 border-border-default">
          <p className="text-sm font-medium">Upload samples of your writing</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="w-full h-40 cursor-pointer mt-3 px-3 py-2 border-2 border-border-default rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 focus:ring-text-medium bg-background-input text-sm"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center justify-end gap-x-2 py-4 px-4">
          <Link
            className="border-2 border-border-default text-sm px-3 py-1 rounded-md cursor-pointer hover:bg-background-hover transition-colors"
            href="/writing-styles"
          >
            Cancel
          </Link>
          <button
            className="bg-primary text-sm text-white border-2 border-border-default cursor-pointer px-3 py-1 rounded-md hover:bg-primary-hover transition-colors"
            type="button"
            onClick={handleCreateWritingStyle}
          >
            Create new writing style
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWritingStyleForm;
