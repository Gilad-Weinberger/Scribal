"use client";

import React, { useState, useRef } from "react";
import { User } from "@/lib/db-schemas";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { uploadProfilePicture } from "@/lib/functions/userFunctions.client";

interface StepProfilePictureProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
}

const StepProfilePicture = ({ data, onUpdate }: StepProfilePictureProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      setIsUploading(true);
      setError(null);
      const { url, error: uploadError } = await uploadProfilePicture(
        user.id,
        file
      );
      if (url) {
        onUpdate({ profilePictureUrl: url });
      } else {
        setError(uploadError);
      }
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Add a profile picture
      </h2>
      <div className="flex items-center space-x-4">
        <Image
          src={data.profilePictureUrl || "/default-avatar.png"}
          alt="Profile Preview"
          width={64}
          height={64}
          className="rounded-full bg-gray-200"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={isUploading}
          />
          <button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Upload a profile picture. You can change this later.
      </p>
    </div>
  );
};

export default StepProfilePicture;
