import { useParams } from "react-router-dom";
import {
  Model,
  ModelExperienceCreateInput,
  ModelUpdateInput,
} from "@jimmodel/shared";
import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";
import { useSearchParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { PersonalForm } from "../../components/model/personal-form";
import { ModelContactForm } from "../../components/model/contact-form";
import { ModelAddressForm } from "../../components/model/address-form";
import { ModelBackgroundForm } from "../../components/model/background-form";
import { ModelExperienceForm } from "../../components/model/experience-form";
import { ModelMeausrementForm } from "../../components/model/measurement-form";
import { Loader2 } from "lucide-react";
import MediaForm from "../../components/model/media-form";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "@/components/shared/page-title";

const menuItems: {
  label: string;
  value: string;
  form?: ({
    handleUpdateModel,
    initialData,
    handleAddImage,
  }: {
    handleUpdateModel: (data: ModelUpdateInput) => void;
    handleAddExperience: (data: ModelExperienceCreateInput) => void;
    handleRemoveExperience: (experienceId: string) => void;
    handleAddImage: (addImageInput: { image: File; type: string }) => void;
    initialData?: Model;
  }) => ReactNode;
}[] = [
  {
    label: "Personal",
    value: "personal",
    form: ({ initialData, handleUpdateModel }) => (
      <PersonalForm onSubmit={handleUpdateModel} initialData={initialData} />
    ),
  },
  {
    label: "Contact",
    value: "contact",
    form: ({ handleUpdateModel, initialData }) => (
      <ModelContactForm
        onSubmit={handleUpdateModel}
        initialData={initialData}
      />
    ),
  },
  {
    label: "Address",
    value: "address",
    form: ({ initialData, handleUpdateModel }) => (
      <ModelAddressForm
        onSubmit={handleUpdateModel}
        initialData={initialData}
      />
    ),
  },
  {
    label: "Background",
    value: "background",
    form: ({ handleUpdateModel, initialData }) => (
      <ModelBackgroundForm
        onSubmit={handleUpdateModel}
        initialData={initialData}
      />
    ),
  },
  {
    label: "Measurements",
    value: "measurements",
    form: ({ handleUpdateModel, initialData }) => (
      <ModelMeausrementForm
        onSubmit={handleUpdateModel}
        initialData={initialData}
      />
    ),
  },
  {
    label: "Experiences",
    value: "experiences",
    form: ({ handleAddExperience, initialData }) => (
      <ModelExperienceForm
        onAddExperience={handleAddExperience}
        initialData={initialData?.experiences}
      />
    ),
  },
  {
    label: "Media",
    value: "media",
    form: ({ handleAddImage, initialData }) => (
      <MediaForm
        onAddImage={handleAddImage}
        images={initialData?.images || []}
      />
    ),
  },
  // { label: "Media", value: "media", form: () => <button>Submit</button> },
];
function UpdateModelPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const { isLoading: isLoadingModel, data } = useQuery({
    queryKey: ["models", id],
    queryFn: id ? () => modelService.getById(id) : undefined,
    enabled: !!id,
  });

  const { mutate: addImage } = useMutation({
    mutationFn: (addImageInput: { image: File; type: string }) => {
      console.log(addImageInput);
      if (!id) {
        throw new Error("Model ID is required");
      }
      return modelService.addImage(id, addImageInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models", id] });
    },
  });

  const { mutate: addExperience } = useMutation({
    mutationFn: (experience: ModelExperienceCreateInput) => {
      if (!id) {
        throw new Error("Model ID is required");
      }

      return modelService.addExperience(id, experience);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models", id] });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: async (data: ModelUpdateInput) => {
      if (!id) {
        throw new Error("Model ID is required");
      }
      return modelService.updateById(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  const initialIndex = menuItems.findIndex(
    (item) => item.value === searchParams.get("form")
  );

  const [formIndex, setFormIndex] = useState(
    initialIndex === -1 ? 0 : initialIndex
  );

  const currentForm = menuItems[formIndex]?.form;

  return (
    <>
      <PageTitle
        title="Update Model"
        subtitle="Update a model record in the database"
      />
      <div className="flex">
        <div className="">
          <SideBar
            onChange={({ index }) => setFormIndex(index)}
            selected={menuItems[formIndex]?.value}
            menuItems={menuItems}
          />
        </div>
        <div className="grow px-8 ">
          {isLoadingModel || currentForm === undefined ? (
            <div className="flex justify-center flex-col items-center space-y-2">
              <Loader2 className="animate-spin" />
              <p>Loading model data</p>
            </div>
          ) : (
            currentForm({
              handleAddImage: addImage,
              handleAddExperience: (data) => addExperience(data),
              handleRemoveExperience: (id) => console.log("removing", id),
              handleUpdateModel: (data) => update(data),
              initialData: data,
            })
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateModelPage;
