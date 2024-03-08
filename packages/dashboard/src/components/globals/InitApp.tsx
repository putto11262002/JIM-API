import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { refreshTokenThunk } from "../../redux/thunk/auth-thunk";
import { useAppDispatch } from "../../redux/hooks";


export default function InitApp({children}: {children?: React.ReactNode}) {
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        dispatch(refreshTokenThunk())
      }, []);
  return (
    <>
    {children ?? <Outlet/>}
    </>
  )
}
