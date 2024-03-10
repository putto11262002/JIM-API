import { z } from "zod"
import { BookingStatus } from "../types/booking-type"
import { PaginatedQuerySchema } from "./paginated-data"


  export const BookingCreateSchema = z.object({
    title: z.string(),
    client: z.string(),
    clientAddress: z.string().optional(),
    personIncharge: z.string().optional(),
    mediaReleased: z.string().optional(),
    periodReleased: z.string().optional(),
    territoriesReleased: z.string().optional(),
    shootingStartDate: z.date().or(z.string().datetime()),
    shootingEndDate: z.date().or(z.string().datetime()),
    fittingStartDate: z.date().or(z.string().datetime()).optional(),
    fittingEndDate: z.date().or(z.string().datetime()).optional(),
    finalMeetingDate: z.date().or(z.string().datetime()).optional(),
    workingHour: z.string().optional(),
    venueOfShoot: z.string().optional(),
    feeAsAgreed: z.string().optional(),
    overtimePerHour: z.string().optional(),
    termsOfPayment: z.string().optional(),
    cancellationFee: z.string().optional(),
    contractDetails: z.string().optional(),
    status: z.nativeEnum(BookingStatus).optional(),
  })

  export const BookingUpdateSchema = z.object({
    title: z.string().optional(),
    client: z.string().optional(),
    clientAddress: z.string().optional(),
    personIncharge: z.string().optional(),
    mediaReleased: z.string().optional(),
    periodReleased: z.string().optional(),
    territoriesReleased: z.string().optional(),
    shootingStartDate: z.date().or(z.string().datetime()).optional(),
    shootingEndDate: z.date().or(z.string().datetime()),
    fittingStartDate: z.date().or(z.string().datetime()).optional(),
    fittingEndDate: z.date().or(z.string().datetime()).optional(),
    finalMeetingDate: z.date().or(z.string().datetime()).optional(),
    workingHour: z.string().optional(),
    venueOfShoot: z.string().optional(),
    feeAsAgreed: z.string().optional(),
    overtimePerHour: z.string().optional(),
    termsOfPayment: z.string().optional(),
    cancellationFee: z.string().optional(),
    contractDetails: z.string().optional(),
    // status: z.nativeEnum(BookingStatus).optional(),
  })

  export const BookingGetQuerySchema = z.object({  
    q: z.string().optional(),
    status: z.nativeEnum(BookingStatus).optional(),  
    modelId: z.string().optional(),  
  }).merge(PaginatedQuerySchema)


  export const BookingAddModelSchema = z.object({
    modelId: z.string(),
  })