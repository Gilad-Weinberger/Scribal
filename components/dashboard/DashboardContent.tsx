import React from "react";

const DashboardContent = () => {
  return (
    <div className="px-42 py-18">
      <div className="text-2xl font-semibold mb-4">Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard content can be expanded here */}
        <div className="bg-white p-6 rounded-lg border border-border-default">
          <h3 className="text-lg font-medium mb-2">Recent Essays</h3>
          <p className="text-text-secondary text-sm">
            No essays yet. Start writing your first essay!
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border-default">
          <h3 className="text-lg font-medium mb-2">Writing Styles</h3>
          <p className="text-text-secondary text-sm">
            Create your first writing style to get started.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border-default">
          <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
          <p className="text-text-secondary text-sm">
            Access your most used features quickly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
