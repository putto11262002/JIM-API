import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import modelService from "../../services/model";

export function useUpdateModelImageType(){
    const returned = useAppMutation({
        mutationFn: modelService.updateModelImageType,
        invalidateQueryKeys: [["models"]],
        notifySuccess: "Image type updated successfully",
        notifyError: true
    })

    return {...returned, updateModelImageType: returned.mutate}
}