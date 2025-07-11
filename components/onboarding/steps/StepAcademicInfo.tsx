"use client";

import React from "react";
import { User } from "@/lib/db-schemas";

interface StepAcademicInfoProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
}

const StepAcademicInfo = ({ data, onUpdate }: StepAcademicInfoProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Tell us about your academics
      </h2>
      <div>
        <label
          htmlFor="university"
          className="block text-sm font-medium text-gray-700"
        >
          University
        </label>
        <input
          type="text"
          name="university"
          id="university"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={data.university || ""}
          onChange={(e) => onUpdate({ university: e.target.value })}
          placeholder="e.g., Harvard University"
        />
      </div>
      <div>
        <label
          htmlFor="major"
          className="block text-sm font-medium text-gray-700"
        >
          Major
        </label>
        <input
          type="text"
          name="major"
          id="major"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={data.major || ""}
          onChange={(e) => onUpdate({ major: e.target.value })}
          placeholder="e.g., Computer Science"
        />
      </div>
    </div>
  );
};

export default StepAcademicInfo;
