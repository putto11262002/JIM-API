import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function NavbarLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0"><NavBar /></div>
      <main className="pt-14 h-screen">{children || <Outlet />}</main>
    </>
  );
}


