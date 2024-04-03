import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { AuthStatus } from "../../redux/auth-reducer";
import LoaderBlock from "../shared/loader-block";

export default function ProtectedRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
 

  useEffect(() => {
    if (status === AuthStatus.UNAUTHENTICATED) {
      navigate("/login");
    }
  }, [status, navigate]);


  if (status === AuthStatus.IDLE) {
    return <div className="mt-6"><LoaderBlock/></div>;
  }

  return <>{children ? children : <Outlet />}</>;
}
