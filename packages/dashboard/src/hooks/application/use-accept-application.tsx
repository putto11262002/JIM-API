import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import modelApplicationService from "../../services/applications";

export function useAcceptApplication(){
    const returned = useAppMutation({
        mutationFn: modelApplicationService.accept,
        invalidateQueryKeys: [["applications"], ["models"] ],
        notifySuccess: "Application accepted",
        notifyError: true
    })

    return {...returned, accept: returned.mutate}
}