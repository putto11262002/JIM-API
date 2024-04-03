import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import jobService from "../../services/job";

export function useRemoveModel(){
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.removeModel,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Model removed successfully"},
    })

    return {removeModel: mutate, status}
}