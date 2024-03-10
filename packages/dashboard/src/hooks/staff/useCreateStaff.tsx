import { StaffWithoutSecrets } from "@jimmodel/shared";
import { AppError } from "../../types/app-error";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import staffService from "../../services/auth";
import { errorInterceptor } from "../../lib/error";

export function useCreateStaff({onSuccess, onError}: {onSuccess?: (staff: StaffWithoutSecrets) => void, onError?: (err: AppError) => void} = {}){
    const queryClient = useQueryClient()
    const [error, setError] = useState<AppError | null>(null);
    const {mutate, isPending} = useMutation({
        mutationFn: staffService.create,
        onSuccess: (staff) => {
            setError(null);
            queryClient.invalidateQueries({queryKey: ["staffs"]})
            if(onSuccess){
                onSuccess(staff)
            }
        },
        onError: (err) => errorInterceptor(err, (err) => {
            setError(err)
            if(onError){
                onError(err)
            }
        })
    })


    return {create: mutate, error, isPending}
}