import { StaffUpdatePasswordInput } from "@jimmodel/shared";
import { AppError } from "../../types/app-error";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { errorInterceptor } from "../../lib/error";

export function useUpdateStaffPassword({updateFn, onError, onSuccess}: {onSuccess?: () => void, onError?: (err: AppError) => void, updateFn: (payload: StaffUpdatePasswordInput) => Promise<void>}){
    const [error, setError] = useState<AppError | null>(null)
    const {mutate, isPending} = useMutation({
        mutationFn: updateFn,
        onSuccess: () => {
            setError(null)
            if(onSuccess) {
                onSuccess()
            }
        },
        onError: (err) => errorInterceptor(err, (err) => {
            setError(err)
            if(onError) {
                onError(err)
            }
        })
    })

    return {update: mutate, error, isPending}
}