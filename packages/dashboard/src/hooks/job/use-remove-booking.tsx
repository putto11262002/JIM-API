import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import jobService from "../../services/job";

export function useRemoveBooking(){
    const {mutate, status} = useAppMutation({
        mutationFn: jobService.removeBooking,
        invalidateQueryKeys: [["jobs"], ["calendar"]],
        notifySuccess: {notify: true, message: "Booking removed successfully"},
    })
    
    return {removeBooking: mutate, status}
}