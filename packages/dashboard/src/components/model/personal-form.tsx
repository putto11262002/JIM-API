import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import z from "zod";
import { ModelCreateFormSchema } from "../../schemas/model";
import { FormDatePickerField } from "../shared/form/FormDatePickerField";
import { FormInputField } from "../shared/form/FormInputField";
import { FromSelectField } from "../shared/form/FormSelectField";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Model } from "@jimmodel/shared";

export const ModelPersonalFormSchema = ModelCreateFormSchema.pick({
  firstName: true,
  lastName: true,
  nickname: true,
  dateOfBirth: true,
  gender: true,
  nationality: true,
  ethnicity: true,
  countryOfResidence: true,
  // spokenLanguages: true,
  passportNumber: true,
  idCardNumber: true,
  taxId: true,
}).and(
  z.object({
    spokenLanguages: z.array(z.object({ language: z.string() })).optional(),
  })
);

export type ModelPersonalForm = z.infer<typeof ModelPersonalFormSchema>;
export function PersonalForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (
    data: Omit<ModelPersonalForm, "spokenLanguages"> & {
      spokenLanguages?: string[];
    }
  ) => void;
  initialData?: Model;
}) {
  const form = useForm<ModelPersonalForm>({
    ...(initialData
      ? {
          defaultValues: {
            ...initialData,
            spokenLanguages: initialData?.spokenLanguages.map((l) => ({
              language: l,
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

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) =>
          onSubmit({
            ...data,
            spokenLanguages: data?.spokenLanguages?.map(
              ({ language }) => language
            ),
          })
        )}
      >
        <FormInputField form={form} name="firstName" />
        <FormInputField form={form} name="lastName" />
        <FormInputField form={form} name="nickname" />

        <FormDatePickerField form={form} name="dateOfBirth" />
        <FromSelectField
          form={form}
          name="gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <FormInputField form={form} name="nationality" />
        <FormInputField form={form} name="ethnicity" />
        <FormInputField form={form} name="countryOfResidence" />

        <div className="space-y-2">
          <p className="text-sm font-medium">Spoken Languages</p>
          {languageFields.fields.map((field, index) => (
            <FormInputField
              key={field.id}
              label=""
              form={form}
              name={`spokenLanguages.${index}.language`}
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
