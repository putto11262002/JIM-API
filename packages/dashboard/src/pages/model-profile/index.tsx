import { useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "../../components/shared/page-title";
import LoaderBlock from "../../components/shared/loader-block";
import ModelPersonalInfoTab from "../../components/model/profile/personal-info-tab";
import ModelContactInfoTab from "../../components/model/profile/contact-info-tab";
import ModelAddressInfoTab from "../../components/model/profile/address-info-tab";
import ModelBackgroundInfoTab from "../../components/model/profile/background-info-tab";
import ModelMeasurementInfoTab from "../../components/model/profile/measurement-info-tab";
import ModelJobsInfoTab from "../../components/model/profile/jobs-info-tab";
import ModelMediaTab from "../../components/model/profile/media-tab";

const menuItems: {
  label: string;
  value: string;
  tab: ({ modelId }: { modelId: string }) => ReactNode;
}[] = [
  {
    label: "Personal",
    value: "personal",
    tab: ({ modelId }) => <ModelPersonalInfoTab modelId={modelId} />,
  },
  {
    label: "Contact",
    value: "contact",
    tab: ({ modelId }) => <ModelContactInfoTab modelId={modelId} />,
  },
  {
    label: "Address",
    value: "address",
    tab: ({ modelId }) => <ModelAddressInfoTab modelId={modelId} />,
  },
  {
    label: "Background",
    value: "background",
    tab: ({ modelId }) => <ModelBackgroundInfoTab modelId={modelId} />,
  },
  {
    label: "Measurements",
    value: "measurements",
    tab: ({ modelId }) => <ModelMeasurementInfoTab modelId={modelId} />,
  },
  {
    label: "Jobs",
    value: "jobs",
    tab: ({ modelId }) => <ModelJobsInfoTab modelId={modelId} />,
  },
  {
    label: "Media",
    value: "media",
    tab: ({ modelId }) => <ModelMediaTab modelId={modelId} />,
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
          {!id || currentTab === undefined ? (
            <LoaderBlock message="Loading model data" />
          ) : (
            currentTab({
              modelId: id,
            })
          )}
        </div>
      </div>
    </>
  );
}

export default ModelProfilePage;
