import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRefreshToken } from "../../hooks/staff/useRefreshToken";


export default function InitApp({children}: {children?: React.ReactNode}) {
    const {refreshToken} = useRefreshToken()
    
    useEffect(() => {
        refreshToken()
      }, []);
  return (
    <>
    {children ?? <Outlet/>}
    </>
  )
}
