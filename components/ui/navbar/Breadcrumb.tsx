"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { writingStylesAPI, documentsAPI } from "@/lib/functions/api-functions";

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
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate breadcrumb items based on pathname
  const generateBreadcrumbs = useCallback(async (): Promise<
    BreadcrumbItem[]
  > => {
    const segments = pathname.split("/").filter((segment) => segment !== "");

    if (segments.length === 0) {
      return [{ name: "Home", href: "/", isActive: true }];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;
      const isActive = i === segments.length - 1;

      // Format segment name for display
      let displayName = segment;

      // Handle known segments
      if (segment === "dashboard") displayName = "Dashboard";
      else if (segment === "documents") displayName = "Documents";
      else if (segment === "writing-styles") displayName = "Writing Styles";
      else if (segment === "settings") displayName = "Settings";
      else if (segment === "create") displayName = "Create";
      else if (segment === "auth") displayName = "Auth";
      else if (segment === "signin") displayName = "Sign In";
      else if (segment === "signup") displayName = "Sign Up";
      else if (segment === "onboarding") displayName = "Onboarding";
      else if (segment === "feedback") displayName = "Feedback";
      else {
        // Handle dynamic segments (IDs) that need to be resolved to names
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            segment
          );

        if (isUUID) {
          // Determine the context based on the previous segment
          const previousSegment = i > 0 ? segments[i - 1] : "";

          if (previousSegment === "writing-styles") {
            // This is a writing style ID
            try {
              const result = await writingStylesAPI.getWritingStyle(segment);
              if (result.success && result.writingStyle) {
                displayName = result.writingStyle.styleName;
              } else {
                displayName = "Writing Style";
              }
            } catch {
              displayName = "Writing Style";
            }
          } else if (
            previousSegment === "documents" ||
            previousSegment === "samples" ||
            previousSegment === "generated"
          ) {
            // This is a document ID - try to get the document
            try {
              const result = await documentsAPI.getDocument(segment);
              if (result.success && result.document) {
                displayName = result.document.title;
              } else {
                displayName = "Document";
              }
            } catch {
              displayName = "Document";
            }
          } else {
            // Default fallback for UUIDs
            displayName = "Item";
          }
        } else {
          // Capitalize and format other segments
          displayName = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        isActive,
      });
    }

    return breadcrumbs;
  }, [pathname]);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      setIsLoading(true);
      try {
        const breadcrumbItems = await generateBreadcrumbs();
        setBreadcrumbs(breadcrumbItems);
      } catch (error) {
        console.error("Error generating breadcrumbs:", error);
        // Fallback to basic breadcrumbs without dynamic names
        const segments = pathname
          .split("/")
          .filter((segment) => segment !== "");
        const fallbackBreadcrumbs: BreadcrumbItem[] = [];
        let currentPath = "";

        segments.forEach((segment, index) => {
          currentPath += `/${segment}`;
          const isActive = index === segments.length - 1;

          let displayName = segment;
          if (segment === "dashboard") displayName = "Dashboard";
          else if (segment === "documents") displayName = "Documents";
          else if (segment === "writing-styles") displayName = "Writing Styles";
          else if (segment === "settings") displayName = "Settings";
          else if (segment === "create") displayName = "Create";
          else if (segment === "auth") displayName = "Auth";
          else if (segment === "signin") displayName = "Sign In";
          else if (segment === "signup") displayName = "Sign Up";
          else if (segment === "onboarding") displayName = "Onboarding";
          else if (segment === "feedback") displayName = "Feedback";
          else {
            displayName = segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          fallbackBreadcrumbs.push({
            name: displayName,
            href: currentPath,
            isActive,
          });
        });

        setBreadcrumbs(fallbackBreadcrumbs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreadcrumbs();
  }, [pathname, generateBreadcrumbs]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
          <LogoIcon />
        </div>
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {/* Logo */}
      <Link
        href="/documents"
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
