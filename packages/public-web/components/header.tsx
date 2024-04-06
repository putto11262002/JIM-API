import { Menu } from "lucide-react";
import React from "react";
import SideNavMenu from "./side-nav-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import TopNavMenu from "./top-nav-menu";
import { headerNavItems } from "../data/nav-menu";

export function Header() {
  return (
    <header className="border- fixed top-0 w-screen z-30 bg-background h-14">
      <div className="py-3 max-w-[1200px] px-5 mx-auto flex items-center justify-between h-full">
        <Link href={"/"}>
          <h1 className="text-xl font-bold">J.I.M</h1>
        </Link>

        <div className="hidden md:inline-block">
          <TopNavMenu items={headerNavItems} />
        </div>

        <SideNavMenu>
          <div className=" md:hidden cursor-pointer hover:bg-muted p-1 rounded-sm">
            <Menu />
          </div>
        </SideNavMenu>
        <Button variant={"outline"} className="hidden md:inline-block">
          Join Us
        </Button>
      </div>
    </header>
  );
}
