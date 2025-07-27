"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LogoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface BreadcrumbItem {
  name: string;
  href: string;
  isActive: boolean;
}

const Breadcrumb = () => {
  const pathname = usePathname();

  // Generate breadcrumb items based on pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter((segment) => segment !== "");

    if (segments.length === 0) {
      return [{ name: "Home", href: "/", isActive: true }];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isActive = index === segments.length - 1;

      // Format segment name for display
      let displayName = segment;
      if (segment === "dashboard") displayName = "Dashboard";
      else if (segment === "documents") displayName = "Documents";
      else if (segment === "writing-styles") displayName = "Writing Styles";
      else if (segment === "create") displayName = "Create";
      else if (segment === "auth") displayName = "Auth";
      else if (segment === "signin") displayName = "Sign In";
      else if (segment === "signup") displayName = "Sign Up";
      else if (segment === "onboarding") displayName = "Onboarding";
      else if (segment === "feedback") displayName = "Feedback";
      else {
        // Capitalize and format other segments
        displayName = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        isActive,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <LogoIcon />
      </Link>

      {/* Separator after logo */}
      {breadcrumbs.length > 0 && <span className="text-gray-400 mx-1">/</span>}

      {/* Breadcrumb items */}
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          {/* Separator */}
          {index > 0 && <span className="text-gray-400 mx-1">/</span>}

          {/* Breadcrumb item */}
          {breadcrumb.isActive ? (
            <span className="text-gray-900 font-medium">{breadcrumb.name}</span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
