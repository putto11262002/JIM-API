import {  JobStatus } from "@jimmodel/shared";
import { Button } from "../../components/ui/button";
import useGetJob from "../../hooks/job/use-get-job";
import LoaderBlock from "../../components/shared/loader-block";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobService from "../../services/job";
import useNotification from "../../hooks/use-notification";


function useArchiveJob(){
  const queryClient = useQueryClient()
  const {success} = useNotification()
  const { mutate } = useMutation({
    mutationFn: (jobId: string) => jobService.archive({ id: jobId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      success("Job archived");
    },
    onError: (err) => console.error(err)
  });

  return {archive: mutate}

}


function useConfirmJob(){
  const queryClient = useQueryClient()
  const {success} = useNotification()
  const {mutate} = useMutation({
    mutationFn: (jobId: string) => jobService.confirm({id: jobId}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      success("Job confirmed")
    }
  })

  return {confirm: mutate}
}




export default function JobActionForm({
  jobId
}: {
  jobId: string
}) {
  const {job, status} = useGetJob({jobId})
  const {confirm} = useConfirmJob()
  const {archive} = useArchiveJob()

  if (status === "pending" || !job) {
    return <LoaderBlock/>
  }
  
  return (
    <div className="space-y-4 flex flex-col">
        <div>
        <Button disabled={job.status === JobStatus.CONFIRMED} variant={"outline"} onClick={() => confirm(job.id)}>Confirm</Button>
         <p className="text-sm text-muted-foreground mt-2">By confirming this option, it will become a job</p>
        </div>
        <div>
        <Button disabled={job.status === JobStatus.ARCHIVED}variant={"outline"} onClick={() => archive(job.id)}>Archive</Button>
          <p className="text-sm text-muted-foreground mt-2">By archiving this job/option it will no longer be display on the calendar</p>
        </div>
    </div>
  );
}
