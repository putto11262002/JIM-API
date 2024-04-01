import { useMutation, useQueryClient } from "@tanstack/react-query";
import JobBookingForm from "../../components/job/job-booking-form";
import useNotification from "../../hooks/use-notification";
import { BookingCreateInput } from "@jimmodel/shared";
import jobService from "../../services/job";
import useGetJob from "../../hooks/job/use-get-job";
import LoaderBlock from "../../components/shared/loader-block";

function useAddBooking() {
  const queryClient = useQueryClient();
  const { success } = useNotification();

  const { mutate } = useMutation({
    mutationFn: ({
      bookingInput,
      jobId,
    }: {
      bookingInput: BookingCreateInput;
      jobId: string;
    }) => jobService.addBooking({ id: jobId, bookingInput }),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      success("Booking added to job");
    },
  });

  return { addBooking: mutate };
}

function useRemoveBooking() {
  const queryClient = useQueryClient();
  const { success } = useNotification();
  const { mutate } = useMutation({
    mutationFn: ({ bookingId }: { jobId: string; bookingId: string }) =>
      jobService.removeBooking({ bookingId }),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      success("Booking removed from job");
    },
  });

  return { removeBooking: mutate };
}

export default function JobBookingUpdateForm({ jobId }: { jobId?: string }) {
  const { job, status } = useGetJob({ jobId });
  const { addBooking } = useAddBooking();
  const { removeBooking } = useRemoveBooking();

  if (status === "pending" || !jobId) {
    return <LoaderBlock />;
  }
  return (
    <JobBookingForm
      bookings={job?.bookings || []}
      onAddBooking={(bookingInput) => addBooking({ jobId, bookingInput })}
      onRemoveBooking={(bookingId) => removeBooking({ jobId, bookingId })}
    />
  );
}
