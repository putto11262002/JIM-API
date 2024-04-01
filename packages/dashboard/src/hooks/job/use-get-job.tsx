import { useQuery } from "@tanstack/react-query";
import jobService from "../../services/job";
export default function useGetJob({jobId}: {jobId?: string}){
    const {data, status, error} = useQuery({
        queryKey: ["jobs", jobId],
        queryFn: jobId ? ({signal}) => jobService.getById({id: jobId, signal}) : undefined,
        enabled: !!jobId,
        staleTime: 1000 * 60 * 5
    })

    return {job: data, status, error}
}