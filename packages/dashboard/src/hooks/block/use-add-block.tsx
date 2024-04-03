import { Block } from "@jimmodel/shared";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import blockService from "../../services/block";

export function useAddBlock({onSuccess}: {onSuccess?: (block: Block) => void} ){
    const returned = useAppMutation({
        mutationFn: blockService.create,
        invalidateQueryKeys: [["blocks"], ["calendar"]],
        notifySuccess: { notify: true, message: "Block created successfully" },
        onSuccess(data) {
            onSuccess && onSuccess(data)
        },
    })

    return {...returned, addBlock: returned.mutate}
}