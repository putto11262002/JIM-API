import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import WithSuspense from "../shared/with-suspense";

export default function PrimaryLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="px-2 pt-4 pb-8 md:px-0">
      <WrappedBody>{children}</WrappedBody>
      </div>
    </>
  );
}


function Body({children}: {children?: React.ReactNode}) {
  return  <main className="mx-auto max-w-[800px] w-full">{children || <Outlet />}</main>
}

const WrappedBody = WithSuspense(Body)