"use client";

import { UserIcon, CogIcon } from "@/components/ui/icons";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SettingsSidebar = ({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) => {
  const menuItems = [
    {
      id: "account",
      label: "Account",
      icon: UserIcon,
      description: "Manage your profile information",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: CogIcon,
      description: "Customize your experience",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
