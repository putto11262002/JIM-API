import { z } from "zod";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { FormInputField } from "../shared/form/FormInputField";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  ModelExperienceCreateInput,
  schemaForType,
  Model,
} from "@jimmodel/shared";
import ExperienceTable from "./experience-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";

export const ModelExperienceFormSchema =
  schemaForType<ModelExperienceCreateInput>()(
    z.object({
      year: z.string(),
      media: z.string(),
      country: z.string(),
      product: z.string(),
      details: z.string().optional().nullable(),
    })
  );

function ExperienceForm({
  onSubmit,
}: {
  onSubmit: (data: ModelExperienceCreateInput) => void;
}) {
  const form = useForm<ModelExperienceCreateInput>({
    resolver: zodResolver(ModelExperienceFormSchema),
  });
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-3"
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        {/* <div className="group w-full p-4 border border-muted rounded-md relative grid grid-cols-2 gap-3"> */}
        {/* <div
                            onClick={() => {
                              experienceFields.remove(index);
                            }}
                            className="flex w-[25px] h-[25px] absolute border justify-center items-center rounded-full top-[-12.5px] right-[-12.5px] bg-white cursor-pointer"
                          >
                            <X className="h-[15px] w-[15px] text-destructive" />
                          </div> */}
        <FormInputField form={form} name={`year`} />

        <FormInputField form={form} name={`media`} />

        <FormInputField form={form} name={`country`} />

        <FormInputField form={form} name={`product`} />

        <FormInputField className="col-span-2" form={form} name={`details`} />
        {/* </div> */}
        <div className="col-span-2">
          <Button className="mt-2" type="submit">
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ModelExperienceForm({
  onAddExperience,
  initialData,
}: {
  onAddExperience: (data: ModelExperienceCreateInput) => void;
  initialData?: Model["experiences"];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <Plus className="mr-2 w-4 h-4" /> Experience
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Experience</DialogTitle>
              <DialogDescription>
                Add experience for the model
              </DialogDescription>
            </DialogHeader>
            <ExperienceForm
              onSubmit={(data) => {
                setOpenDialog(false);
                onAddExperience(data);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {initialData !== undefined && initialData.length > 0 && (
        <div className="mt-3">
          <ExperienceTable experiences={initialData} />
        </div>
      )}
    </>
  );
}
