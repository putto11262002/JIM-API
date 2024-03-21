import { JobStatus } from "@jimmodel/shared";

export const JobStatusLabel = {
  [JobStatus.CONFIRMED]: "Job",
  [JobStatus.ARCHIVED]: "Archived",
  [JobStatus.PENDING]: "Option"
}
