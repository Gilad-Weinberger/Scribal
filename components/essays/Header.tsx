import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Link href="/">
        <p className="text-2xl font-bold">New Essay</p>
      </Link>
    </div>
  );
};

export default Header;
