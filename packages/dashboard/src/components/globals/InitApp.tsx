import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRefreshToken } from "../../hooks/staff/useRefreshToken";

export default function InitApp({ children }: { children?: React.ReactNode }) {
  const { refreshToken } = useRefreshToken();

  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <>
      <div className="hidden md:block">{children ?? <Outlet />}</div>
      <div className=" md:hidden flex items-center justify-center flex-col h-screen  w-screen text-center">
        <h2 className="text-xl font-bold">J.I.M</h2>
        <h2 className="text-sm text-muted-foreground">
          Model Management platform
        </h2>
        <p className="mt-4 text-sm">
          The appliction does not currently support mobile view.{" "}
        </p>
      </div>
    </>
  );
}
