import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";

export default function useRemoveImage() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({
      imageId,
    }: {
      imageId: string
      modelId: string
    }) => {
      if (!imageId) {
        throw new Error("Model ID is required");
      }
      return modelService.removeImage({imageId});
    },
    onSuccess: (_, {modelId}) => {
      queryClient.invalidateQueries({ queryKey: ["models", modelId] });
    },
  });

  return { removeImage: mutate };
}
