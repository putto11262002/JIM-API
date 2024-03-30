import { useParams } from "react-router-dom";
import { Job, Model } from "@jimmodel/shared";
import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import modelService from "../../services/model";
import { useSearchParams } from "react-router-dom";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "../../components/shared/page-title";
import LoaderBlock from "../../components/shared/loader-block";
import ModelPersonalInfoTab from "../../components/model/profile/personal-info-tab";
import ModelContactInfoTab from "../../components/model/profile/contact-info-tab";
import ModelAddressInfoTab from "../../components/model/profile/address-info-tab";
import ModelBackgroundInfoTab from "../../components/model/profile/background-info-tab";
import ModelMeasurementInfoTab from "../../components/model/profile/measurement-info-tab";
import jobService from "../../services/job";
import ModelJobsInfoTab from "../../components/model/profile/jobs-info-tab";
import ModelMediaTab from "../../components/model/profile/media-tab";

const menuItems: {
  label: string;
  value: string;
  tab: ({ model, modelJobs }: { model: Model; modelJobs: Job[] }) => ReactNode;
}[] = [
  {
    label: "Personal",
    value: "personal",
    tab: ({ model }) => <ModelPersonalInfoTab model={model} />,
  },
  {
    label: "Contact",
    value: "contact",
    tab: ({ model }) => <ModelContactInfoTab model={model} />,
  },
  {
    label: "Address",
    value: "address",
    tab: ({ model }) => <ModelAddressInfoTab model={model} />,
  },
  {
    label: "Background",
    value: "background",
    tab: ({ model }) => <ModelBackgroundInfoTab model={model} />,
  },
  {
    label: "Measurements",
    value: "measurements",
    tab: ({ model }) => <ModelMeasurementInfoTab model={model} />,
  },
  {
    label: "Jobs",
    value: "jobs",
    tab: ({ modelJobs }) => <ModelJobsInfoTab modelJobs={modelJobs} />,
  },
  {
    label: "Media",
    value: "media",
    tab: ({ model }) => <ModelMediaTab model={model} />,
  },
];

function ModelProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialIndex = menuItems.findIndex(
    (item) => item.value === searchParams.get("tab")
  );

  const [tabIndex, setTabInex] = useState(
    initialIndex === -1 ? 0 : initialIndex
  );

  const currentTab = menuItems[tabIndex]?.tab;

  const { isLoading: isLoadingModel, data } = useQuery({
    queryKey: ["models", id],
    queryFn: id ? () => modelService.getById(id) : undefined,
    enabled: !!id,
  });

  const { isLoading: isLoadingModelJob, data: paginatedModelJob } = useQuery({
    queryKey: ["models", id, "jobs", { page: 1, pageSize: 10 }],
    queryFn: id
      ? ({ signal }) =>
          jobService.getModelJobs({
            modelId: id,
            query: { page: 1, pageSize: 10 },
            signal,
          })
      : undefined,
    enabled: "jobs" === menuItems[tabIndex]?.value,
  });

  return (
    <>
      <PageTitle title="Model Profile" />
      <div className="flex">
        <div className="">
          <SideBar
            onChange={({ index, value }) => {
              setSearchParams((prev) => ({ ...prev, tab: value }), {
                replace: true,
              });
              setTabInex(index);
            }}
            selected={menuItems[tabIndex]?.value}
            menuItems={menuItems}
          />
        </div>
        <div className="grow px-8 ">
          {isLoadingModel || currentTab === undefined || data === undefined ? (
            <LoaderBlock message="Loading model data" />
          ) : (
            currentTab({
              model: data,
              modelJobs: paginatedModelJob?.data || [],
            })
          )}
        </div>
      </div>
    </>
  );
}

export default ModelProfilePage;
