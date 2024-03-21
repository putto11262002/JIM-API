import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { Job, JobStatus } from "@jimmodel/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobService from "../../services/job";
import useNotification from "../../hooks/use-notification";
import { lowerCase } from "lodash";
import { errorInterceptorV2 } from "../../lib/error";
import { AppError } from "../../types/app-error";
export function JobDropdownMenu({
  children,
  job,
}: {
  children: ReactNode;
  job: Job;
}) {
  const { success } = useNotification();

  const queryClient = useQueryClient()

  const { mutate } = useMutation<void, AppError, { status: JobStatus }>({
    mutationFn: ({ status }: { status: JobStatus }) =>
      errorInterceptorV2(jobService.updateById, {
        id: job.id,
        input: { status },
      }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({queryKey: ['jobs']})
      queryClient.invalidateQueries({queryKey: ["calendar"]})
      success(`Job has been ${lowerCase(status)}`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <Link to={`/jobs/${job.id}/update`}>
          <DropdownMenuItem>Update</DropdownMenuItem>
        </Link>
       {job.status !== JobStatus.CONFIRMED &&  <DropdownMenuItem onClick={() => mutate({status: JobStatus.CONFIRMED})} >Confirm</DropdownMenuItem>}
        {job.status !== JobStatus.ARCHIVED && <DropdownMenuItem onClick={() => mutate({status: JobStatus.ARCHIVED})}>Archive</DropdownMenuItem>}
       {/* { <DropdownMenuItem>Cancel</DropdownMenuItem>} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
