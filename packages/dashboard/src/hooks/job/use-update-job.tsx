import { useMutation, useQueryClient } from "@tanstack/react-query";
import {JobUpdateInput} from "@jimmodel/shared"
import jobService from "../../services/job";
export default function useUpdateJob() {
    const queryClient = useQueryClient()
    const {mutate, status} = useMutation({
        mutationFn: ({jobId, input}: {jobId: string, input: JobUpdateInput}) => jobService.updateById({id: jobId, input}),
        onSuccess: (_, {jobId}) => {
            queryClient.invalidateQueries({queryKey: ["jobs", jobId]})
        },
    })

    return {update: mutate, status}

}