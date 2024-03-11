import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { AppError } from "../../types/app-error"
import modelApplicationService from "../../services/applications"
import { errorInterceptor } from "../../lib/error"

export function useArchiveApplication({onSuccess, onError}: {onSuccess?: () => void, onError?: (error: AppError) => void} = {}){
    const [error, setError] = useState<AppError | null>(null)
    const queryClient = useQueryClient()
    const {mutate, isPending} = useMutation({
        mutationFn: modelApplicationService.archive,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["applications"]})
            if (onSuccess){
                onSuccess()
            }
        },
        onError: (err) => errorInterceptor(err, (err) => {
            setError(err)
            if (onError){
                onError(err)
            }
        })
    })

    return {archive: mutate, isPending, error}
}