import JobDetailsForm from "../../components/job/job-details-form";
import useGetJob from "../../hooks/job/use-get-job";
import useUpdateJob from "../../hooks/job/use-update-job";

export default function JobDetailsUpdateForm({jobId}: {jobId: string}) {
    const {job} = useGetJob({jobId})
    const {update} = useUpdateJob()
   
    return (
       <JobDetailsForm onSubmit={(data) => update({id: jobId, input: data})} initialData={job}/>
    )
}