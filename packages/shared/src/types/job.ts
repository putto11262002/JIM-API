import { Prisma, Job as _Job, JobStatus as _JobStatus, Booking as _Booking } from "@prisma/client"
import { Model } from "./model-type"
import {  paginatedDataQuery } from "./pagingated-data-type"
import { Staff } from "./staff-type"
export type JobCreateInput = Omit<Prisma.JobCreateInput, "createdBy" | "models" | "bookings">

export type JobUpdateInput = Omit<Prisma.JobUpdateInput, "createdBy" | "models" | "bookings">

export type Job = _Job  & {
    createdBy: Staff
    models: Model[]
    bookings: Booking[]
}

export type JobStatus = _JobStatus
export const JobStatus = _JobStatus

export type JobGetQuery = {
    status?: string
    q?: string
} & paginatedDataQuery


export type JobAddModelInput = {
    modelId: string
}



export type BookingCreateInput = Omit<Prisma.BookingCreateInput, "job" |  "models"> & {modelIds?: string[]}


export type Booking = _Booking

export type BookingWithJob = Booking & {
  job: Job
}
