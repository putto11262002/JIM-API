import { useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "../../components/shared/page-title";
import LoaderBlock from "../../components/shared/loader-block";
import ModelPersonalInfoTab from "./personal-info-tab";
import ModelContactInfoTab from "./contact-info-tab";
import ModelAddressInfoTab from "./address-info-tab";
import ModelBackgroundInfoTab from "./background-info-tab";
import ModelMeasurementInfoTab from "./measurement-info-tab";
import ModelJobsInfoTab from "./jobs-info-tab";
import ModelMediaTab from "./media-tab";
import ModelProfileOverview from "./overview";
import { Separator } from "../../components/ui/separator";

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
    label: "Books",
    value: "book",
    tab: ({ modelId }) => <ModelMediaTab type="book" modelId={modelId} />,
  },
  {
    label: "Polaroids",
    value: "polaroid",
    tab: ({ modelId }) => <ModelMediaTab type="polaroid" modelId={modelId} />,
  },
  {
    label: "Composites",
    value: "composite",
    tab: ({ modelId }) => <ModelMediaTab type="composite" modelId={modelId} />,
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

  function handleTabChange({ index, value }: { index: number; value: string }) {
    setSearchParams((prev) => ({ ...prev, tab: value }), {
      replace: true,
    });
    setTabInex(index);
  }

  function renderCurrentTab() {
    const currentTab = menuItems[tabIndex]?.tab;
    if (!id || currentTab === undefined) {
      return <LoaderBlock message="Loading model data" />;
    } else {
      return currentTab({
        modelId: id,
      });
    }
  }

  return (
    <>
      <PageTitle title="Model Profile" />
      <Separator className="my-6 mt-2" />
      <ModelProfileOverview modelId={id}/>
      <Separator className="my-6"/>
      <div className="flex">
        <div className="">
          <SideBar
            onChange={handleTabChange}
            selected={menuItems[tabIndex]?.value}
            menuItems={menuItems}
          />
        </div>
   
        <div className="grow px-8 ">{renderCurrentTab()}</div>
      </div>
    </>
  );
}

export default ModelProfilePage;
