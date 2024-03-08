import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function PrimaryLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="px-2 pt-4 md:px-0"><main className="mx-auto max-w-[800px] w-full">{children || <Outlet />}</main></div>
    </>
  );
}
