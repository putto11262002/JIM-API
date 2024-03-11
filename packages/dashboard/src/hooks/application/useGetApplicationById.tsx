
import { useQuery } from "@tanstack/react-query";
import modelApplicationService from "../../services/applications";
import { AppError } from "../../types/app-error";
import { useEffect, useState } from "react";
import { errorInterceptor } from "../../lib/error";

export function useGetApplication({id}: {id: string | undefined}){
    const [error, setError] = useState<AppError | null>(null)
    const {data, isPending, error: _error, } = useQuery({
        queryKey: ["applications", id],
        queryFn: () => {
            if (!id) return Promise.reject(new Error("id is required"))
            return modelApplicationService.getById(id)
        },
        enabled: !!id
    })

    useEffect(() => {
        if (_error){
            errorInterceptor(_error, setError)
        }
    }, [_error])

 

    return {data, isPending, error, }

}