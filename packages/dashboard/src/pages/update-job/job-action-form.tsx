import { JobStatus } from "@jimmodel/shared";
import { Button } from "../../components/ui/button";
import useGetJob from "../../hooks/job/use-get-job";
import { useUpdateJobStatus } from "../../hooks/job/use-update-job-status";

function JobActionForm({ jobId }: { jobId: string }) {
  const { job } = useGetJob({ jobId });
  const { updateStatus } = useUpdateJobStatus();

  return (
    <div className="space-y-4 flex flex-col">
      <div>
        <Button
          disabled={job.status === JobStatus.CONFIRMED}
          variant={"outline"}
          onClick={() =>
            updateStatus({ id: job.id, status: JobStatus.CONFIRMED })
          }
        >
          Confirm
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          By confirming this option, it will become a job
        </p>
      </div>
      <div>
        <Button
          disabled={job.status === JobStatus.ARCHIVED}
          variant={"outline"}
          onClick={() =>
            updateStatus({ id: job.id, status: JobStatus.ARCHIVED })
          }
        >
          Archive
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          By archiving this job/option it will no longer be display on the
          calendar
        </p>
      </div>
    </div>
  );
}

export default JobActionForm;
