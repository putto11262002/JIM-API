import modelService from "../../services/model";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";

export default function useAddImage() {
  const {mutate, status} = useAppMutation({
    mutationFn: modelService.addImage,
    invalidateQueryKeys: [["models"]],
    notifySuccess: { notify: true, message: "Image added successfully" },
  })

  return {                                                                                                           addImage: mutate, status };
}
