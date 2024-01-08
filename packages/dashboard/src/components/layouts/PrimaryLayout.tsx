import React from "react";
import {  Outlet } from "react-router-dom";
import NavBar from "./NavBar";





export default function PrimaryLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
 
  return (
    <>
    <NavBar/>
       
      <main>{children || <Outlet />}</main>
    </>
  );
}
