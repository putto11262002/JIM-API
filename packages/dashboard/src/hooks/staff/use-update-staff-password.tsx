import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import staffService from "../../services/auth";

export function useUpdateStaffPassword(){
    const returned = useAppMutation({
        mutationFn: staffService.updateStaffPasswordById,
        invalidateQueryKeys: [["staffs"]],
        notifyError: { notify: false },
        notifySuccess: {
          notify: true,
          message: "Successfully updated staff",
        },
      });

      return {...returned, update: returned.mutate};
}