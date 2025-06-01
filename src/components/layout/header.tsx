import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <header className="flex justify-between py-6">
      <div>
        <Link href={"/"} className="text-3xl font-bold">
          <span className="text-[#fafad2]">EZ </span>
          <span className="text-[#282d33]">SHARE</span>
        </Link>
      </div>
      <nav className="flex gap-4 text-md">
        <Link
          href="/"
          className="px-2 font-medium hover:bg-accent/50 rounded-2xl"
        >
          About
        </Link>
        <Link
          href="/"
          className="px-2 font-medium hover:bg-accent/50 rounded-2xl"
        >
          Sponsors
        </Link>
      </nav>
    </header>
  );
};
