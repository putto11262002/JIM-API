import { useQuery } from "@tanstack/react-query";
import modelApplicationService from "../../services/applications";
import { ModelApplicationGetQuery } from "@jimmodel/shared";
import { useEffect, useState } from "react";
import { AppError } from "../../types/app-error";
import { errorInterceptor,  } from "../../lib/error";

export function useGetApplications({query}: {query?: ModelApplicationGetQuery} = {}) {
    const [error, setError] = useState<AppError | null>(null)
    const {refetch, isPending, error: _error, data} = useQuery({
        queryKey: ["applications", query],
        queryFn: () => modelApplicationService.getAll({...query, })
    })

    useEffect(() => {
        if (_error){
            errorInterceptor(_error, setError)
        }

    }, [_error])


    return {refetch, isPending, error, data}

}