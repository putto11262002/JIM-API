import JobBookingForm from "../../components/job/job-booking-form";
import useGetJob from "../../hooks/job/use-get-job";
import { useRemoveBooking } from "../../hooks/job/use-remove-booking";
import { useAddBooking } from "../../hooks/job/use-add-booking";



export default function JobBookingUpdateForm({ jobId }: { jobId: string }) {
  const { job } = useGetJob({ jobId });
  const {removeBooking}= useRemoveBooking()
  const {addBooking}= useAddBooking()

  return (
    <JobBookingForm
      bookings={job?.bookings || []}
      onAddBooking={(bookingInput) => addBooking({ id: jobId, bookingInput })}
      onRemoveBooking={(bookingId) => removeBooking({ bookingId })}
    />
  );
}
