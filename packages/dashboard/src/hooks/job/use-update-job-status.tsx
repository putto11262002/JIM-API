import { JobStatus } from "@jimmodel/shared";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import jobService from "../../services/job";

export function useUpdateJobStatus(){
    const {mutate, status} = useAppMutation({
        mutationFn: ({signal, status, id}: {signal?: AbortSignal, status: JobStatus, id: string})  => jobService.updateById({id, signal, input: {status}}),
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Job status successfully updated"}
    })

    return {updateStatus: mutate, status}

}