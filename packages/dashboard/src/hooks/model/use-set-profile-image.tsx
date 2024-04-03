import modelService from "../../services/model";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";

export default function useSetProfileImage() {
  const {mutate, status} = useAppMutation({
    mutationFn: modelService.setProfileImage,
    notifySuccess: { notify: true, message: "Model updated successfully" },
    invalidateQueryKeys: [["models"]],
  })

  return { setProfile: mutate, status };
}
