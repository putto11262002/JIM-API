import JobDetailsForm from "../../components/job/job-details-form";
import LoaderBlock from "../../components/shared/loader-block";
import useGetJob from "../../hooks/job/use-get-job";
import useUpdateJob from "../../hooks/job/use-update-job";

export default function JobDetailsUpdateForm({jobId}: {jobId?: string}) {
    const {job, status} = useGetJob({jobId})
    const {update} = useUpdateJob()
    if (status === "pending" || !jobId) {
        return <LoaderBlock/>
    }
    return (
       <JobDetailsForm onSubmit={(data) => update({jobId, input: data})} initialData={job}/>
    )
}