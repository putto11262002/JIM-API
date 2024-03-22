import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Form } from "../../ui/form";
import { Booking, BookingCreateInput } from "@jimmodel/shared";
import { useState } from "react";
import { FormDatePickerField } from "../../shared/form/FormDatePickerField";
import { FromSelectField } from "../../shared/form/FormSelectField";
import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import utc from "dayjs/plugin/utc";
import BookingDataTable from "./booking-table";
dayjs.extend(utc);
const timeOptions = [
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
  { label: "18:00", value: "18:00" },
  { label: "19:00", value: "19:00" },
  { label: "20:00", value: "20:00" },
  { label: "21:00", value: "21:00" },
  { label: "22:00", value: "22:00" },
  { label: "23:00", value: "23:00" },
];

const BookingCreateFormSchema = z
  .object({
    startDate: z.date(),
    startTime: z.string(),
    endDate: z.date(),
    endTime: z.string(),
    type: z.string(),
    dates: z.any(),
  })
  .superRefine((data, ctx) => {
    const start = dayjs(data.startDate)
      .set("hour", parseInt(data.startTime.split(":")[0]))
      .set("minute", parseInt(data.startTime.split(":")[1]));
    const end = dayjs(data.endDate)
      .set("hour", parseInt(data.endTime.split(":")[0]))
      .set("minute", parseInt(data.endTime.split(":")[1]));
    if (end.isBefore(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["dates"],
      });
    }
  });

const FormDataToBookingCreateInput = z
  .object({
    startDate: z.date(),
    startTime: z.string(),
    endDate: z.date(),
    endTime: z.string(),
    type: z.string(),
  })
  .transform((data) => {
    return {
      start: dayjs(data.startDate)
        .add(parseInt(data.startTime.split(":")[0]), "hour")
        .add(parseInt(data.startTime.split(":")[1]), "minute")
        .toDate()
        .toISOString(),
      end: dayjs(data.endDate)
        .add(parseInt(data.endTime.split(":")[0]), "hour")
        .add(parseInt(data.endTime.split(":")[1]), "minute")
        .toDate()
        .toISOString(),
      type: data.type,
    };
  });

function AddBookingForm({
  onSubmit,
}: {
  onSubmit: (data: BookingCreateInput) => void;
}) {
  const form = useForm<z.infer<typeof BookingCreateFormSchema>>({
    resolver: zodResolver(BookingCreateFormSchema),
  });

  return (
    <Form {...form}>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit((data) => {
          onSubmit(FormDataToBookingCreateInput.parse(data));
        })}
      >
        {form.formState?.errors?.dates && (
          <p className="text-danger text-sm font-medium">
            {form.formState.errors.dates.message?.toString()}
          </p>
        )}
        <FormDatePickerField form={form} name="startDate" />{" "}
        <FromSelectField
          label=""
          name="startTime"
          form={form}
          options={timeOptions}
        />
        <FormDatePickerField calendarProps={{}} form={form} name="endDate" />{" "}
        <FromSelectField
          label=""
          name="endTime"
          form={form}
          options={timeOptions}
        />
        <FromSelectField
          form={form}
          name="type"
          options={[
            { label: "Fitting", value: "fitting" },
            { label: "Shooting", value: "shooting" },
            { label: "Final Meeting", value: "final-meeting" },
          ]}
        />
        <div>
          <Button>Save</Button>
        </div>
      </form>
    </Form>
  );
}


function AddBookingDialog({
  onSubmit,
}: {
  onSubmit: (data: BookingCreateInput) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Add Booking</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Booking to Job</DialogTitle>
        </DialogHeader>
        <AddBookingForm
          onSubmit={(data) => {
            setOpen(false);
            onSubmit(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
function JobBookingForm({
  onAddBooking,
  bookings,
  onRemoveBooking,
}: {
  onAddBooking: (data: BookingCreateInput) => void;
  bookings: Booking[];
  onRemoveBooking: (bookingId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <AddBookingDialog onSubmit={onAddBooking} />

      <BookingDataTable onRemoveBooking={onRemoveBooking} bookings={bookings} />
    </div>
  );
}

export default JobBookingForm;
