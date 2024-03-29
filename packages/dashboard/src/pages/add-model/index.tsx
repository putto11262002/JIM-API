import { Model, ModelCreateInput } from "@jimmodel/shared";
import { z } from "zod";
import { ModelCreateFormSchema } from "../../schemas/model";
import { ReactNode, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import modelService from "../../services/model";
import { Link } from "react-router-dom";
import { PersonalForm } from "../../components/model/personal-form";
import { ModelContactForm } from "../../components/model/contact-form";
import { ModelAddressForm } from "../../components/model/address-form";
import { ModelBackgroundForm } from "../../components/model/background-form";
import { ModelMeausrementForm } from "../../components/model/measurement-form";
import {
  AlertDialog,
  AlertDialogContent,
} from "../../components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { AppError } from "../../types/app-error";
import { errorInterceptor } from "../../lib/error";
import { SideBar } from "../../components/shared/form-side-menu";
import PageTitle from "../../components/shared/page-title";
import LoaderBlock from "../../components/shared/loader-block";
import ErrorBlock from "../../components/shared/error-block";

type ModelCreateForm = z.infer<typeof ModelCreateFormSchema>;

const menuItems: {
  label: string;
  value: string;
  form?: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => ReactNode;
}[] = [
  {
    label: "Personal",
    value: "personal",
    form: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => (
      <PersonalForm onSubmit={handleSubmit} />
    ),
  },
  {
    label: "Contact",
    value: "contact",
    form: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => (
      <ModelContactForm onSubmit={handleSubmit} />
    ),
  },
  {
    label: "Address",
    value: "address",
    form: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => (
      <ModelAddressForm onSubmit={handleSubmit} />
    ),
  },
  {
    label: "Background",
    value: "background",
    form: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => (
      <ModelBackgroundForm onSubmit={handleSubmit} />
    ),
  },
  {
    label: "Measurements",
    value: "measurements",
    form: (handleSubmit: (data: Partial<ModelCreateForm>) => void) => (
      <ModelMeausrementForm onSubmit={handleSubmit} />
    ),
  },
  // { label: "Media", value: "media", form: () => <button>Submit</button> },
];

function useCreateModel({
  onSuccess,
  onError,
}: {
  onSuccess?: (createdModel: Model) => void;
  onError?: (error: AppError) => void;
} = {}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AppError | null>(null);
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: Partial<ModelCreateForm>) => {
      const model = await modelService.create(data as ModelCreateInput);
      return model;
    },
    onSuccess: (createdModel) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      setError(null);
      if (onSuccess) {
        onSuccess(createdModel);
      }
    },
    onError: (err) =>
      errorInterceptor(err, (err) => {
        setError(err);
        if (onError) {
          onError(err);
        }
      }),
  });

  return { isPending, error, create: mutate };
}

function AddModelSuccessDialog({
  createdModel,
  onClose,
}: {
  onClose: () => void;
  createdModel: Model | null;
}) {
  if (createdModel === null) {
    return null;
  }
  return (
    <AlertDialog open={true}>
      <AlertDialogContent asChild={false}>
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="text-green-700" />
          <p className="font-medium">Model added to database</p>
          <p className="text-sm">Continue to:</p>
          <div className="flex flex-col space-y-2">
            <Link
              className="w-full"
              to={`/models/${createdModel.id}/update?form=experiences`}
            >
              <Button className="w-full" variant={"outline"} size={"sm"}>
                Add model experience
              </Button>
            </Link>
            <Link
              className=""
              to={`/models/${createdModel.id}/update?form=media`}
            >
              <Button className="w-full" variant={"outline"} size={"sm"}>
                Add model media
              </Button>
            </Link>
          </div>
          <Button
            onClick={() => onClose()}
            className="underline"
            variant={"link"}
          >
            Add another model
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddModelPage() {
  const [createdModel, setCreatedModel] = useState<Model | null>(null);
  const [formIndex, setFormIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<ModelCreateForm>>({});

  const { create, isPending, error } = useCreateModel({
    onSuccess: (model) => {
      setCreatedModel(model);
      setFormData({});
      setFormIndex(0);
    },
  });

  const handleSubmit = (data: Partial<ModelCreateForm>) => {
    if (formIndex < menuItems.length - 1) {
      setFormData({ ...formData, ...data });
      setFormIndex(formIndex + 1);
    } else {
      const newFormData = { ...formData, ...data };
      setFormData(newFormData);
      create(newFormData);
    }
  };

  const currentForm = menuItems[formIndex]?.form;

  return (
    <>
      <AddModelSuccessDialog
        createdModel={createdModel}
        onClose={() => setCreatedModel(null)}
      />
      <PageTitle
        title="Add Model"
        subtitle="Add a model record to the database"
      />
      <div className="flex">
        <div className="">
          <SideBar
            selected={menuItems[formIndex]?.value}
            menuItems={menuItems}
          />
        </div>
        <div className="grow px-8 ">
          {isPending || currentForm === undefined ? (
          <LoaderBlock message="Saving model"/>
          ) : error ? (
          <ErrorBlock error={error}/>
            ) : (
            currentForm(handleSubmit)
          )}
        </div>
      </div>
    </>
  );
}

export default AddModelPage;
