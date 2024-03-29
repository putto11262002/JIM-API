import {
  Job,
  JobCreateInput,
  JobStatus,
} from "@jimmodel/shared";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobService from "../../services/job";
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



function CreateJobSuccessDialog({
  createdJob,
  onSkip,
}: {
  createdJob: Job | null;
  onSkip: () => void;
}) {
  if (!createdJob){
    return null
  }
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="text-success" />
          <p className="font-medium">{createdJob.status === JobStatus.PENDING ? "Option" : "Job"} added to database</p>
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
            <Link className="" to={`/jobs/${createdJob.id}/update?form=booking`}>
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

// function useAppMutation<T, R>({fn}: {fn: (arg: T) => Promise<R>}) {
//   return useMutation({
//     mutationFn: async (arg: T) =>{
//       try{
//         const res = await fn(arg);
//         return res;
//       }catch(err){
//         // TODO: error handling logic
//         throw new 
//       }
//     },
//     onSuccess: (data) => {
      
//     }
//   })
// }

function AddJobPage() {
  const [submittedJob, setSubmittedJob] = useState<Job | null>(null);
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient();

  const jobStatus = searchParams.get("status")?.toUpperCase() === JobStatus.PENDING ? JobStatus.PENDING : JobStatus.CONFIRMED; 

  const { mutate: createJob } = useMutation({
    mutationFn: (data: JobCreateInput) => jobService.create({...data, status: jobStatus}),
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
      <CreateJobSuccessDialog
        onSkip={() => setSubmittedJob(null)}
        createdJob={submittedJob}
      />
      <PageTitle title={`Add ${jobStatus === JobStatus.PENDING ? "Option" : "Job"}`} subtitle={`Add ${jobStatus === JobStatus.PENDING ? "option" : "job"} record to the database`} />
      <JobDetailsForm initialData={{status: jobStatus}} onSubmit={createJob} />
    </>
  );
}

export default AddJobPage;
