"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "./navbar/Breadcrumb";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userImage = user?.profilePictureUrl;
  return (
    <div>
      <div className="flex items-center fixed bg-background-secondary w-full justify-between h-12 border-b-2 border-border-default px-4">
        <div className="flex items-center gap-x-2">
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            href="/feedback"
            className="flex items-center gap-x-2 rounded-full border-2 border-border-default hover:border-border-medium px-2.5 py-1 text-xs h-8"
            onClick={() => router.push("/feedback")}
          >
            Feedback
          </Link>
          <Link
            href="/feedback"
            className="flex items-center justify-center h-8 w-8 bg-[#171717] rounded-full overflow-hidden"
          >
            {userImage ? (
              <Image
                src={userImage}
                alt="User profile picture"
                width={32}
                height={32}
                className="object-cover w-8 h-8"
                onError={(e) => {
                  e.currentTarget.src = "/user.svg";
                }}
                priority={false}
              />
            ) : (
              <Image
                src="/user.svg"
                alt="User"
                width={18}
                height={18}
                style={{ filter: "invert(1)" }}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
