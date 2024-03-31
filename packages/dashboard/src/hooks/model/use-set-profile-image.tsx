import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";

export default function useSetProfileImage() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ imageId }: { imageId: string; modelId: string }) =>
      modelService.setProfileImage({ imageId }),
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: ["models", modelId] });
    },
  });

  return { setProfile: mutate, isPending };
}
