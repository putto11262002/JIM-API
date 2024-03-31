import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";

export default function useAddImage() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({
      imageCreateInput,
      id,
    }: {
      imageCreateInput: { image: File; type: string };
      id: string;
    }) => {
      if (!id) {
        throw new Error("Model ID is required");
      }
      return modelService.addImage(id, imageCreateInput);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["models", id] });
    },
  });

  return { addImage: mutate };
}
