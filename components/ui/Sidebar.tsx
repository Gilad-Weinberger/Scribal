"use client";

import React from "react";
import { sidebarItems } from "@/lib/data/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full items-center fixed top-12 w-14 border-r-2 border-border-default py-3 gap-y-2 bg-background-secondary">
      {sidebarItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <div
            key={item.id}
            className="relative group w-full flex items-center justify-center"
          >
            <Link
              href={item.href}
              className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                ${isActive ? "text-[#171716] bg-[#ededed]" : "text-[#8a8a8a]"}
                hover:text-[#171716] hover:bg-[#ededed]`}
            >
              <item.icon />
            </Link>
            <span className="absolute left-full -ml-1 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background-secondary text-black border-2 border-border-light px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 pointer-events-none group-hover:pointer-events-auto transition-all text-xs z-10">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
