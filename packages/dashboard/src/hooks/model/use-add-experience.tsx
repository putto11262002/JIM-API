import modelService from "../../services/model";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";

export default function useAddExperience() {
 const {mutate, status} = useAppMutation({
  mutationFn: modelService.addExperience,
  notifySuccess: { notify: true, message: "Experience added successfully" },
  invalidateQueryKeys: [["models"]],
 })

  return { addExperience: mutate, status };
}
