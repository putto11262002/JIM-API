import { Job, JobStatus } from "@jimmodel/shared";
import { Button } from "../ui/button";

export default function JobActionForm({
  onConfirm,
  onArchive,
  data,
}: {
  onConfirm: (jobId: string) => void;
  onArchive: (jobId: string) => void;
  data: Partial<Job> & { status: JobStatus; id: string };
}) {
  
  return (
    <div className="space-y-4 flex flex-col">
        <div>
        <Button disabled={data.status === JobStatus.CONFIRMED} variant={"outline"} onClick={() => onConfirm(data.id)}>Confirm</Button>
         <p className="text-sm text-muted-foreground mt-2">By confirming this option, it will become a job</p>
        </div>
        <div>
        <Button disabled={data.status === JobStatus.ARCHIVED}variant={"outline"} onClick={() => onArchive(data.id)}>Archive</Button>
          <p className="text-sm text-muted-foreground mt-2">By archiving this job/option it will no longer be display on the calendar</p>
        </div>
    </div>
  );
}
