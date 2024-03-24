
import {
  Job,
  JobCreateInput,
} from "@jimmodel/shared";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobService from "../../services/job";
import { Button } from "../../components/ui/button";

import {
  AlertDialog,
  AlertDialogContent,
} from "../../components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PageTitle from "../../components/shared/page-title";
import JobDetailsForm from "../../components/job/job-details-form";



function CreateJobSuccessDialog({
  createdJob,
  onSkip,
}: {
  createdJob: Job | null;
  onSkip: () => void;
}) {
  return (
    <AlertDialog open={createdJob !== null}>
      <AlertDialogContent>
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="text-success" />
          <p className="font-medium">Job added to database</p>
          <p className="text-sm">Continue to:</p>
          <div className="flex flex-col space-y-2">
            <Link
              className="w-full"
              to={`/jobs/${createdJob?.id}/update#model`}
            >
              {" "}
              <Button className="w-full" variant={"outline"} size={"sm"}>
                Add models
              </Button>
            </Link>
            <Link className="" to={`/jobs/${createdJob?.id}/update#booking`}>
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

  const queryClient = useQueryClient();
  const { mutate: createJob } = useMutation({
    mutationFn: (data: JobCreateInput) => jobService.create(data),
    onSuccess: (job) => {
      setSubmittedJob(job);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      setSubmittedJob(null);
      console.log(err);
    },
  });

  return (
    <>
      <PageTitle title="Add Job" subtitle="Add job record to the database" />
      <CreateJobSuccessDialog
        onSkip={() => setSubmittedJob(null)}
        createdJob={submittedJob}
      />

      <JobDetailsForm onSubmit={createJob} />
    </>
  );
}

export default AddJobPage;
