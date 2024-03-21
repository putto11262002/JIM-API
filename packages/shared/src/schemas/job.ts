import { z } from "zod";
import { schemaForType } from "../utils";
import {
  BookingCreateInput,
  JobAddModelInput,
  JobCreateInput,
  JobGetQuery,
  JobStatus,
  JobUpdateInput,
} from "../types";
import { PaginatedQuerySchema } from "./paginated-data";
export const JobCreateSchema = schemaForType<JobCreateInput>()(
  z.object({
    // id: z.string().optional(),
    title: z.string(),
    client: z.string(),
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
    status: z.nativeEnum(JobStatus),
  })
);

export const JobUpdateSchema = schemaForType<JobUpdateInput>()(
  z.object({
    // id: z.string().optional(),
    title: z.string().optional(),
    client: z.string().optional(),
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
    status: z.nativeEnum(JobStatus).optional(),
  })
);

export const JobGetQuerySchma = schemaForType<JobGetQuery>()(
  z.object({
    status: z.nativeEnum(JobStatus).optional(),
    q: z.string().optional(),
    page: PaginatedQuerySchema.shape.page,
    pageSize: PaginatedQuerySchema.shape.pageSize,
    // sortBy: z
    //     .nativeEnum(JobStatus)
    //     .optional(),
    // sortOrder: z.enum(["asc", "desc"]).optional(),
  })
);

export const JobAddModelSchema = schemaForType<JobAddModelInput>()(
  z.object({
    modelId: z.string(),
  })
);

export const BookingCreateInputSchema = schemaForType<BookingCreateInput>()(
  z.object({
    start: z.string().datetime({offset: false}),
    end: z.string().datetime({offset: false}),
    type: z.string(),
    // modelIds: z.array(z.string()).optional(),
  })
);
