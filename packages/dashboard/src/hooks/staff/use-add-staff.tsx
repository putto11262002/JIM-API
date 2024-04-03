import staffService from "../../services/auth";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import {  StaffWithoutSecrets } from "@jimmodel/shared";


export function useAddStaff({onSuccess}: {onSuccess?: (staff: StaffWithoutSecrets) => void}){
    const returned = useAppMutation({
        mutationFn: staffService.create,
        invalidateQueryKeys: [["staffs"]],
        notifySuccess: {notify: true, message: "Staff added successfully"},
        onSuccess(data,) {
            onSuccess && onSuccess(data)
        },
    })

    return {...returned, addStaff: returned.mutate}
}