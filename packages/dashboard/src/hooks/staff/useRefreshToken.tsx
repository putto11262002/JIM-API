import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import staffService from "../../services/auth";
import { AppError } from "../../types/app-error";
import { errorInterceptor } from "../../lib/error";
import { useAppDispatch } from "../../redux/hooks";
import { authenticate, unauthenticate } from "../../redux/auth-reducer";

export function useRefreshToken(){
    const [error, setError] = useState<AppError | null>(null);
    const dispatch = useAppDispatch()
    const {mutate, isPending} = useMutation({
        mutationFn: staffService.refreshToken, 
        onSuccess: (result) => {
            setError(null)
            dispatch(authenticate(result.staff))
        },
        onError: (err) => errorInterceptor(err, (err) => {
            setError(err)
            dispatch(unauthenticate())
        })
    })

    return {refreshToken: mutate, isPending, error}


}