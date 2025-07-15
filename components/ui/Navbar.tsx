"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userImage = user?.profilePictureUrl;
  return (
    <div>
      <div className="flex items-center fixed bg-[#fcfcfc] w-full justify-between h-12 border-b-2 border-[#dfdfdf] px-4">
        <div className="flex items-center gap-x-2">
          <Image src="/globe.svg" alt="logo" width={20} height={20} />
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            href="/feedback"
            className="flex items-center gap-x-2 rounded-full border-2 border-[#dfdfdf] hover:border-[#B2B2B2] px-2.5 py-1 text-xs h-8"
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
