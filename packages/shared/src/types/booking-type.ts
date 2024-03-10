import { Prisma, Booking as _Booking, BookingStatus as _BookingStatus } from "@prisma/client";
import { z } from "zod";
import { BookingCreateSchema, BookingGetQuerySchema, BookingUpdateSchema } from "@jimmodel/shared/src/schemas/booking-schema";

export type Booking = _Booking;

export type BookingStatus = _BookingStatus

export const BookingStatus = _BookingStatus

export type BookingCreateInput = z.infer<typeof BookingCreateSchema>

export type BookingUpdateInput = z.infer<typeof BookingUpdateSchema>

export type BookingGetQuery = z.infer<typeof BookingGetQuerySchema>