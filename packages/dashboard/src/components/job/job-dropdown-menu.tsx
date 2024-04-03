import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { Job, JobStatus } from "@jimmodel/shared";
import { useUpdateJobStatus } from "../../hooks/job/use-update-job-status";

export function JobDropdownMenu({
  children,
  job,
}: {
  children: ReactNode;
  job: Job;
}) {
  const {updateStatus} = useUpdateJobStatus()



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <Link to={`/jobs/${job.id}/update`}>
          <DropdownMenuItem>Update</DropdownMenuItem>
        </Link>
       {job.status !== JobStatus.CONFIRMED &&  <DropdownMenuItem onClick={() => updateStatus({id: job.id, status: JobStatus.CONFIRMED})} >Confirm</DropdownMenuItem>}
        {job.status !== JobStatus.ARCHIVED && <DropdownMenuItem onClick={() => updateStatus({id: job.id, status: JobStatus.ARCHIVED})}>Archive</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
