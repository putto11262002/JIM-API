import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation"
import jobService from "../../services/job"

export function useAddModel(){
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.addModel,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Model added successfully"},
    })
    
    return {addModel: mutate, status}
}