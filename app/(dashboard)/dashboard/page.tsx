import React from "react";
import { LayoutMain } from "@/components/ui";
import { DashboardContent } from "@/components/dashboard";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <LayoutMain>
        <DashboardContent />
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default page;
