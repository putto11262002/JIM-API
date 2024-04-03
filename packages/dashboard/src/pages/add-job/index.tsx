import { Job, JobStatus } from "@jimmodel/shared";
import { Button } from "../../components/ui/button";

import {
  AlertDialog,
  AlertDialogContent,
} from "../../components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import PageTitle from "../../components/shared/page-title";
import JobDetailsForm from "../../components/job/job-details-form";
import { Separator } from "../../components/ui/separator";
import { useAddJob } from "../../hooks/job/use-add-job";

function CreateJobSuccessDialog({
  createdJob,
  onSkip,
}: {
  createdJob: Job | null;
  onSkip: () => void;
}) {
  if (!createdJob) {
    return null;
  }
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="text-success" />
          <p className="font-medium">
            {createdJob.status === JobStatus.PENDING ? "Option" : "Job"} added
            to database
          </p>
          <p className="text-sm">Continue to:</p>
          <div className="flex flex-col space-y-2">
            <Link
              className="w-full"
              to={`/jobs/${createdJob.id}/update?form=model`}
            >
              {" "}
              <Button className="w-full" variant={"outline"} size={"sm"}>
                Add models
              </Button>
            </Link>
            <Link
              className=""
              to={`/jobs/${createdJob.id}/update?form=booking`}
            >
              <Button className="w-full" variant={"outline"} size={"sm"}>
                Add bookings
              </Button>
            </Link>
          </div>
          <Button
            onClick={() => onSkip()}
            variant={"link"}
            className="underline"
          >
            Skip
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddJobPage() {
  const [submittedJob, setSubmittedJob] = useState<Job | null>(null);
  const [searchParams] = useSearchParams();

  const jobStatus =
    searchParams.get("status")?.toUpperCase() === JobStatus.PENDING
      ? JobStatus.PENDING
      : JobStatus.CONFIRMED;

  const { addJob } = useAddJob({
    onSuccess: (job) => {
      setSubmittedJob(job);
    },
  });

  return (
    <>
      <CreateJobSuccessDialog
        onSkip={() => setSubmittedJob(null)}
        createdJob={submittedJob}
      />
      <PageTitle
        title={`Add ${jobStatus === JobStatus.PENDING ? "Option" : "Job"}`}
        subtitle={`Add ${
          jobStatus === JobStatus.PENDING ? "option" : "job"
        } record to the database`}
      />
      <Separator className="my-6 mt-2" />
      <JobDetailsForm initialData={{ status: jobStatus }} onSubmit={addJob} />
    </>
  );
}

export default AddJobPage;
