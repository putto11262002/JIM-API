import { ReactNode, useState } from "react";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "../../components/shared/page-title";
import { useParams, useSearchParams } from "react-router-dom";
import { JobStatus } from "@jimmodel/shared";
import LoaderBlock from "../../components/shared/loader-block";
import JobActionForm from "./job-action-form";
import { Separator } from "../../components/ui/separator";
import JobDetailsUpdateForm from "./job-details-update-form";
import JobModelUpdateForm from "./job-model-update-form";
import JobBookingUpdateForm from "./job-booking-update-form";
import useGetJob from "../../hooks/job/use-get-job";

const menuItems: {
  label: string;
  value: string;
  form?: ({ jobId }: { jobId: string }) => ReactNode;
}[] = [
  {
    label: "Details",
    value: "job-details",
    form: ({ jobId }) => <JobDetailsUpdateForm jobId={jobId} />,
  },
  {
    label: "Models",
    value: "model",
    form: ({ jobId }) => <JobModelUpdateForm jobId={jobId} />,
  },
  {
    label: "Booking",
    value: "booking",
    form: ({ jobId }) => <JobBookingUpdateForm jobId={jobId} />,
  },
  {
    label: "Actions",
    value: "actions",
    form: ({ jobId }) => <JobActionForm jobId={jobId} />,
  },
];

function UpdateJobPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParam, setSearchParam] = useSearchParams();
  const initialFormIndex = menuItems.findIndex(
    ({ value }) => value === searchParam.get("form")
  );
  const [formIndex, setFormIndex] = useState(
    initialFormIndex === -1 ? 0 : initialFormIndex
  );

  const { job } = useGetJob({ jobId: id });

  const currentForm = menuItems[formIndex].form;

  function renderForm() {
    if (currentForm === undefined || !id) {
      return <LoaderBlock message="Loading job data..." />;
    } else {
      return currentForm({
        jobId: id,
      });
    }
  }

  return (
    <>
      <PageTitle
        title={`Edit ${job?.status === JobStatus.PENDING ? "Option" : "Job"}`}
        subtitle={`Edit ${
          job?.status === JobStatus.PENDING ? "Option" : "Job"
        } recrod in the database`}
      />
      <Separator className="my-6 mt-2" />
      <div className="flex gap-8">
        <div className="">
          <SideBar
            menuItems={menuItems}
            selected={menuItems[formIndex].value}
            onChange={({ index }) => {
              setFormIndex(index);
              setSearchParam(
                (prev) => ({ ...prev, form: menuItems[index].value }),
                { replace: true }
              );
            }}
          />
        </div>
        <div className="grow">{renderForm()}</div>
      </div>
    </>
  );
}

export default UpdateJobPage;
