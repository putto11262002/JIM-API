import { Job, JobCreateInput, JobStatus, schemaForType } from "@jimmodel/shared";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { FormTextareaField } from "../shared/form/ForTextareaField";
import { FormInputField } from "../shared/form/FormInputField";
// import { FromSelectField } from "../shared/form/FormSelectField";
import z  from "zod";


const JobCreateFormSchema = schemaForType<JobCreateInput>()(
    z.object({
      title: z.string().min(1, "Required"),
      client: z.string().min(1, "Required"),
      clientAddress: z.string().nullable().optional(),
      personInCharge: z.string().nullable().optional(),
      mediaReleased: z.string().nullable().optional(),
      periodReleased: z.string().nullable().optional(),
      territoriesReleased: z.string().nullable().optional(),
      workingHour: z.string().nullable().optional(),
      venueOfShoot: z.string().nullable().optional(),
      feeAsAgreed: z.string().nullable().optional(),
      overtimePerHour: z.string().nullable().optional(),
      termsOfPayment: z.string().nullable().optional(),
      cancellationFee: z.string().nullable().optional(),
      contractDetails: z.string().nullable().optional(),
      status: z.nativeEnum(JobStatus) })
  );
  

function JobDetailsForm({ onSubmit, initialData }: { onSubmit: (data: JobCreateInput) => void, initialData?: Partial<Job> }) {
    const form = useForm<JobCreateInput>({
      resolver: zodResolver(JobCreateFormSchema),
      defaultValues: initialData,
    });

    return (
      <Form {...form}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((data) => {
            form.reset();
            onSubmit(data);
          })}
        >
          <FormInputField form={form} name="title" />
          <FormInputField form={form} name="client" />
          <FormInputField form={form} name="clientAddress" />
          <FormInputField form={form} name="personInCharge" />
          <FormInputField form={form} name="mediaReleased" />
          <FormInputField form={form} name="periodReleased" />
          <FormInputField form={form} name="territoriesReleased" />
          <FormInputField form={form} name="workingHour" />
          <FormInputField form={form} name="venueOfShoot" />
          <FormInputField form={form} name="feeAsAgreed" />
          <FormInputField form={form} name="overtimePerHour" />
          <FormInputField form={form} name="termsOfPayment" />
          <FormInputField form={form} name="cancellationFee" />
          <FormTextareaField form={form} name="contractDetails" />
          <Button type="submit" className="mt-2">
            Save
          </Button>
        </form>
      </Form>
    );
  }

  export default JobDetailsForm