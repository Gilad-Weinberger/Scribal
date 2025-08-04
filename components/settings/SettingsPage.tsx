"use client";

import { useState } from "react";
import LayoutMain from "@/components/ui/LayoutMain";
import {
  SettingsSidebar,
  AccountSettings,
  PreferencesSettings,
} from "@/components/settings";
import ProtectedRoute from "../ui/ProtectedRoute";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "preferences":
        return <PreferencesSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <ProtectedRoute>
      <LayoutMain>
        <div className="py-18 px-36">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Settings Sidebar */}
            <div className="lg:col-span-2 lg:order-1">
              <SettingsSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 lg:order-2">{renderContent()}</div>
          </div>
        </div>
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default SettingsPage;
