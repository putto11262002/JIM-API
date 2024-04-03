import jobService from "../../services/job";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
export default function useUpdateJob() {
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.updateById,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Job updated successfully"},
    })

    return {update: mutate, status}

}