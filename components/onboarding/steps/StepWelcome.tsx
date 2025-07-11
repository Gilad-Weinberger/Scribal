"use client";

import React from "react";
import { User } from "@/lib/db-schemas";

interface StepWelcomeProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
}

const StepWelcome = ({ data, onUpdate }: StepWelcomeProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Welcome! What should we call you?
      </h2>
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          type="text"
          name="displayName"
          id="displayName"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={data.displayName || ""}
          onChange={(e) => onUpdate({ displayName: e.target.value })}
          placeholder="e.g., Jane Doe"
        />
      </div>
    </div>
  );
};

export default StepWelcome;
