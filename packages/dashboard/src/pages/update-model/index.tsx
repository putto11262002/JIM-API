import { useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "@/components/shared/page-title";
import LoaderBlock from "../../components/shared/loader-block";
import ModelPersonalInfoUpdateForm from "./personal-info-update-form";
import ModelContactInfoUpdateForm from "./contact-info-update-form";
import ModelAddressInfoUpdateForm from "./address-info-update-form";
import ExperienceUpdateForm from "./experiences-update-form";
import ModelMeasurementInfoUpdateForm from "./meaaurement-info-update-form";
import ModelBackgroundInfoUpdateForm from "./background-info-update-form";
import ModelMediaUpdateForm from "./model-media-update-form";

const menuItems: {
  label: string;
  value: string;
  form?: ({
    modelId
  }: {

    modelId: string
  }) => ReactNode;
}[] = [
  {
    label: "Personal",
    value: "personal",
    form: ({ modelId }) => (
      <ModelPersonalInfoUpdateForm id={modelId}/>
    ),
  },
  {
    label: "Contact",
    value: "contact",
    form: ({ modelId }) => (
      <ModelContactInfoUpdateForm id={modelId}/>
    ),
  },
  {
    label: "Address",
    value: "address",
    form: ({ modelId }) => (
      <ModelAddressInfoUpdateForm id={modelId}/>
    ),
  },
  {
    label: "Background",
    value: "background",
    form: ({ modelId }) => (
      <ModelBackgroundInfoUpdateForm
        id={modelId}
      />
    ),
  },
  {
    label: "Measurements",
    value: "measurements",
    form: ({ modelId }) => (
      <ModelMeasurementInfoUpdateForm id={modelId}/>
    ),
  },
  {
    label: "Experiences",
    value: "experiences",
    form: ({ modelId}) => (
      <ExperienceUpdateForm id={modelId}/>
    ),
  },
  {
    label: "Books",
    value: "book",
    form: ({ modelId }) => (
      <ModelMediaUpdateForm modelId={modelId} type="book"/>
    ),
  },
  {
    label: "Polaroids",
    value: "polaroid",
    form: ({ modelId }) => (
      <ModelMediaUpdateForm modelId={modelId} type="polaroid"/>
    ),
  },
  {
    label: "Composites",
    value: "composite",
    form: ({ modelId }) => (
      <ModelMediaUpdateForm modelId={modelId} type="composite"/>
    ),
  }
];

function UpdateModelPage() {
  const { id } = useParams<{ id: string }>();
 
  const [searchParams, setSearchParams] = useSearchParams();

  const initialIndex = menuItems.findIndex(
    (item) => item.value === searchParams.get("form")
  );

  const [formIndex, setFormIndex] = useState(
    initialIndex === -1 ? 0 : initialIndex
  );

  const currentForm = menuItems[formIndex]?.form;

  function handleTabChange({ index, value }: { index: number; value: string }) {
    setSearchParams((prev) => ({ ...prev, form: value }), {
      replace: true,
    });
    setFormIndex(index);
  }

  function renderCurrrentForm() {
    if (currentForm === undefined || !id) {
      return <LoaderBlock message="Loading model data" />;
    } else {
      return currentForm({
        modelId: id
      });
    }
  }

  return (
    <>
      <PageTitle
        title="Update Model"
        subtitle="Update a model record in the database"
      />
      <Separator className="my-6 mt-3"/>
      <div className="flex">
        <div className="">
          <SideBar
            onChange={handleTabChange}
            selected={menuItems[formIndex]?.value}
            menuItems={menuItems}
          />
        </div>
        <div className="grow px-8 ">{renderCurrrentForm()}</div>
      </div>
    </>
  );
}

export default UpdateModelPage;
