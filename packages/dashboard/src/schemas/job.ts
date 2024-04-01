import z from "zod"
import { schemaForType, JobCreateInput, JobStatus } from "@jimmodel/shared";

export const JobCreateFormSchema = schemaForType<JobCreateInput>()(
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