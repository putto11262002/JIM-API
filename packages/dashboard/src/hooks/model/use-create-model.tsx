import { Model } from "@jimmodel/shared";
import useAppMutation, { UseAppMutationProps } from "../../lib/react-query-wrapper/use-app-mutation";
import modelService from "../../services/model";

export function useCreateModel(props: Partial<Omit<UseAppMutationProps<Model, Parameters<typeof modelService.create>[0]>, "mutationFn">>){

    const returned = useAppMutation({
        mutationFn: modelService.create,
        notifySuccess: "Model created successfully",
        invalidateQueryKeys: [["models"]],
        ...props
    })

    return returned

}