import * as db from "@prisma/client"
import { Model } from "./model-type.js"
import {  paginatedDataQuery } from "./pagingated-data-type.js"
import { Staff } from "./staff-type.js"
import _ from "lodash"

export type JobCreateInput = Omit<db.Prisma.JobCreateInput, "createdBy" | "models" | "bookings"> & {
    status: JobCreateJobStatus
}

export type JobUpdateInput = Omit<db.Prisma.JobUpdateInput, "createdBy" | "models" | "bookings">

export type Job = db.Job  & {
    createdBy: Staff
    models: Model[]
    bookings: Booking[]
}

export type JobStatus = db.JobStatus
export const JobStatus = db.JobStatus

export type  JobCreateJobStatus = Exclude<JobStatus, "ARCHIVED">
export const JobCreateJobStatus = _.omit(JobStatus, ["ARCHIVED"])
export type JobGetQuery = {
    status?: string
    q?: string
} & paginatedDataQuery


export type JobAddModelInput = {
    modelId: string
}



export type BookingCreateInput = Omit<db.Prisma.BookingCreateInput, "job" |  "models"> & {modelIds?: string[]}


export type Booking = db.Booking

export type BookingWithJob = Booking & {
  job: Job
}
