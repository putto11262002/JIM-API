import { ModelExperienceCreateInput } from "@jimmodel/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";

export default function useAddExperience() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      modelId,
      experience,
    }: {
      modelId: string;
      experience: ModelExperienceCreateInput;
    }) => {
      if (!modelId) {
        throw new Error("Model ID is required");
      }

      return modelService.addExperience(modelId, experience);
    },
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: ["models", modelId] });
    },
  });

  return { addExperience: mutate, isPending };
}
