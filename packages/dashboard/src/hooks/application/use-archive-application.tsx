import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import modelApplicationService from "../../services/applications";

export function useArchiveApplication(){
    const returned = useAppMutation({
        mutationFn: modelApplicationService.archive,
        invalidateQueryKeys: [["applications"], ["models"]],
        notifySuccess: "Application archived",
        notifyError: true
    })

    return {...returned, archive: returned.mutate}
}