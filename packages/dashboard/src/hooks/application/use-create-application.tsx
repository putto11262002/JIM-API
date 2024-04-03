import { ModelApplicationCreateInput } from "@jimmodel/shared";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import modelApplicationService from "../../services/applications";

export function useCreateApplication(){
    const returned = useAppMutation({
        mutationFn: async ({modelApplicationInput, images}: {modelApplicationInput: ModelApplicationCreateInput, images: File[]}) => {
            const application = await modelApplicationService.create({input: modelApplicationInput});
            await modelApplicationService.addImages({id: application.id, images});
            return application;
        },
        invalidateQueryKeys: [["applications"]],
    })

    return {...returned, create: returned.mutate}
}