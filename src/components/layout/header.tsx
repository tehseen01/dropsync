import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="container flex justify-between py-6">
      <div>
        <Link href={"/"} className="text-3xl font-bold">
          <span className="text-primary">QR </span>
          <span className="text-[#282d33]">SHARE</span>
        </Link>
      </div>
      <nav className="text-md flex gap-4">
        <Button variant={"outline"} size={"lg"}>
          Send
        </Button>
        <Button size={"lg"}>Receive</Button>
      </nav>
    </header>
  );
};
