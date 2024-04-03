import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import jobService from "../../services/job";

export function useAddBooking(){
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.addBooking,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Booking added successfully"},
    })

    return {addBooking: mutate, status}
}