import { Job } from "@jimmodel/shared";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import jobService from "../../services/job";

export function useAddJob({onSuccess}: {onSuccess?: (job: Job) => void}){
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.create,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Job added successfully"},
        onSuccess(data) {
            onSuccess && onSuccess(data)
        },
    })


    return {addJob: mutate, status}
}