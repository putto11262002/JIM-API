import { ModelUpdateInput } from "@jimmodel/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";

export default function useUpdateModel(){
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async ({id, input}: {id: string, input: ModelUpdateInput}) => {
          if (!id) {
            throw new Error("Model ID is required");
          }
          return modelService.updateById(id, input);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["models"] });
        },
      });

      return {update: mutate, isPending}
}