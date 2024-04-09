import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import z from "zod";
import { ModelCreateFormSchema } from "./schema";
import { FormDatePickerField } from "../shared/form/FormDatePickerField";
import { FormInputField } from "../shared/form/FormInputField";
import { FromSelectField } from "../shared/form/FormSelectField";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  Country,
  Ethnicity,
  Langauge,
  Model,
} from "@jimmodel/shared";
import { lowerCase, upperFirst } from "lodash";
import { ModelGender } from "../../types/model";

export const ModelPersonalFormSchema = ModelCreateFormSchema.pick({
  name: true,
  nickname: true,
  dateOfBirth: true,
  gender: true,
  nationality: true,
  ethnicity: true,
  countryOfResidence: true,
  passportNumber: true,
  idCardNumber: true,
  taxId: true,
}).and(
  z.object({
    spokenLanguages: z.array(z.object({ language: z.string() })).optional(),
  })
);

const CleanFormDataSchema = ModelPersonalFormSchema.transform((data) => {
  return {
    ...data,
    spokenLanguages: data?.spokenLanguages?.map(({ language }) => language),
  };
});

export type ModelPersonalForm = z.infer<typeof ModelPersonalFormSchema>;

type ModelPersonalInfoFormProps = {
  onSubmit: (
    data: Omit<ModelPersonalForm, "spokenLanguages"> & {
      spokenLanguages?: string[];
    }
  ) => void;
  initialData?: Model;
};

export function PersonalForm({
  onSubmit,
  initialData,
}: ModelPersonalInfoFormProps) {
  const form = useForm<ModelPersonalForm>({
    ...(initialData
      ? {
          defaultValues: {
            ...initialData,
            spokenLanguages: initialData?.spokenLanguages.map((language) => ({
              language,
            })),
          },
        }
      : {}),
    resolver: zodResolver(ModelPersonalFormSchema),
  });

  const languageFields = useFieldArray({
    control: form.control,
    name: "spokenLanguages",
  });

  function handleSubmit(data: ModelPersonalForm) {
    const cleanedData = CleanFormDataSchema.parse(data);
    onSubmit(cleanedData);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
      >
        <FormInputField form={form} name="name" />
        <FormInputField form={form} name="nickname" />
        <FormDatePickerField form={form} name="dateOfBirth" />
        <FromSelectField
          form={form}
          name="gender"
          options={(Object.values(ModelGender)).map(
            (gender) => ({
              label: upperFirst(lowerCase(gender.replace("_", " "))),
              value: gender,
            })
          )}
        />
        <FromSelectField
          name="nationality"
          form={form}
          options={Country.map((c) => ({ label: c, value: c }))}
        />
        <FromSelectField
          name={`ethnicity`}
          form={form}
          options={Ethnicity.map((e) => ({ label: e, value: e }))}
        />
        <FromSelectField
          name="countryOfResidence"
          form={form}
          options={Country.map((c) => ({ label: c, value: c }))}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">Spoken Languages</p>
          {languageFields.fields.map((field, index) => (
            <FromSelectField
              name={`spokenLanguages.${index}.language`}
              form={form}
              key={field.id}
              options={Langauge.map((e) => ({ label: e, value: e }))}
            />
          ))}
          <Button
            type="button"
            size={"sm"}
            className="mt-2"
            onClick={() => languageFields.append({ language: "" })}
            variant={"outline"}
          >
            Add Language
          </Button>
        </div>
        <FormInputField form={form} name="passportNumber" />
        <FormInputField form={form} name="idCardNumber" />
        <FormInputField form={form} name="taxId" />
        <Button className="mt-6" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
