import { useState } from "react";
import { AppError } from "../../types/app-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffUpdateInput } from "@jimmodel/shared";
import { errorInterceptor } from "../../lib/error";

export function useUpdateStaff({onSuccess, onError, updateFn}: {onSuccess?: () => void, onError?: (err: AppError) => void, updateFn: (payload: StaffUpdateInput) => Promise<void>}){
    const queryClient = useQueryClient()
    const [error, setError] = useState<AppError | null>(null)
    const {mutate, isPending} = useMutation({
        mutationFn: updateFn,
        onSuccess: () => {
            setError(null)
            queryClient.invalidateQueries({queryKey: ["staffs"]})
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: (err) => errorInterceptor(err, (err) => {
            setError(err)
            if (onError) {
                onError(err)
            }
        })

    })

    return {update: mutate, error, isPending}

}