import { z } from "zod";
import { ModelCreateFormSchema } from "./schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { FormInputField } from "../shared/form/FormInputField";
import { Button } from "../ui/button";

export const ModelBackgroundFormSchema = ModelCreateFormSchema.pick({
  occupation: true,
  highestLevelOfEducation: true,
  aboutMe: true,
  medicalBackground: true,
}).and(
  z.object({
    talents: z
      .array(
        z.object({
          talent: z.string(),
        })
      )
      .optional(),
  })
);

const CleanedModelBackgroundFormSchema = ModelBackgroundFormSchema.transform(
  (data) => {
    return {
      ...data,
      talents: data?.talents?.map(({ talent }) => talent),
    };
  }
);

export type ModelBackgroundForm = z.infer<typeof ModelBackgroundFormSchema>;

type ModelBackgroundFormProps = {
  onSubmit: (
    data: Omit<ModelBackgroundForm, "talents"> & { talents?: string[] }
  ) => void;
  initialData?: Omit<ModelBackgroundForm, "talents"> & { talents?: string[] };
}

export function ModelBackgroundForm({
  onSubmit,
  initialData,
}: ModelBackgroundFormProps) {

  const form = useForm<ModelBackgroundForm>({
    ...(initialData
      ? {
          defaultValues: {
            ...initialData,
            talents: initialData?.talents?.map((talent) => ({ talent })),
          },
        }
      : {}),
    resolver: zodResolver(ModelBackgroundFormSchema),
  });

  const talentFields = useFieldArray({
    control: form.control,
    name: "talents",
  });

  function handleSubmit(data: ModelBackgroundForm){
    const clearnedData = CleanedModelBackgroundFormSchema.parse(data);
    onSubmit(clearnedData);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
      >
        <FormInputField form={form} name="occupation" />
        <FormInputField
          form={form}
          name="highestLevelOfEducation"
          label="Highest Level of Education"
        />
        <FormInputField form={form} name="aboutMe" />
        <FormInputField form={form} name="medicalBackground" />
        <div className="space-y-2">
          <p className="text-sm font-medium ">Talents</p>
          {talentFields.fields.map((field, index) => (
            <FormInputField
              key={field.id}
              form={form}
              name={`talents.${index}.talent`}
              label={""}
            />
          ))}
          <Button
            type="button"
            size={"sm"}
            className="mt-2"
            onClick={() => talentFields.append({ talent: "" })}
            variant="outline"
          >
            Add Talent
          </Button>
        </div>
        <Button className="mt-6" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
