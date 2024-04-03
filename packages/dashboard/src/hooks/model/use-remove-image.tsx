import modelService from "../../services/model";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";

export default function useRemoveImage() {

  const {mutate, status} = useAppMutation({
    mutationFn: modelService.removeImage,
    invalidateQueryKeys: [["models"]],
    notifySuccess: {notify: true, message: "Image removed successfully"},
  })

  return {removeImage: mutate, status}
}
