import modelService from "../../services/model";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";

export default function useUpdateModel(){
   const {mutate, status} = useAppMutation({
    mutationFn: modelService.updateById,
    notifySuccess: {notify: true, message: 'Model updated successfully'},
    invalidateQueryKeys: [['models']]
   })

      return {update: mutate, status}
}