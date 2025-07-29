import React from "react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div>page</div>
    </ProtectedRoute>
  );
};

export default page;
