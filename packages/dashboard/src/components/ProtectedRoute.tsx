import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { AuthStatus } from "../redux/auth-reducer";

export default function ProtectedRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { status, isLogin } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
 

  useEffect(() => {
    if (status !== AuthStatus.LOADING && !isLogin) {
      navigate("/login");
    }
  }, [status, isLogin, navigate]);


  if (status === AuthStatus.LOADING) {
    return <div>Loading...</div>;
  }

  return <>{children ? children : <Outlet />}</>;
}
