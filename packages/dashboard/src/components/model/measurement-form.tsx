import { z } from "zod";
import { ModelCreateFormSchema } from "../../schemas/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { FormInputField } from "../shared/form/FormInputField";
import { Button } from "../ui/button";

export const ModelMeasurementFormSchema = ModelCreateFormSchema.pick({
   height: true,
    weight: true,
    bust: true,
    collar: true,
    aroundArmpit: true,
    aroundArmToWrist1: true,
    aroundArmToWrist2: true,
    aroundArmToWrist3: true,
    armLength1: true,
    armLength2: true,
    aroundThickToAnkle: true,
    trousersLength: true,
    chestHeight: true,
    chestWidth: true,
    waist: true,
    hips: true,
    shoulder: true,
    frontShoulder: true,
    backShoulder: true,
    crotch: true,
    braSize: true,
    suitDressSize: true,
    hairColor: true,
    eyeColor: true,
});

export type ModelMeasurementForm = z.infer<typeof ModelMeasurementFormSchema>;

export function ModelMeausrementForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: ModelMeasurementForm) => void;
  initialData?: ModelMeasurementForm ;
}) {
  const form = useForm<ModelMeasurementForm>({
    ...(initialData ? { defaultValues: initialData } : {}),
    resolver: zodResolver(ModelMeasurementFormSchema),
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        <FormInputField form={form} name="height" />
        <FormInputField form={form} name="weight" />
        <FormInputField form={form} name="bust" />
        <FormInputField form={form} name="collar" />
        <FormInputField form={form} name="aroundArmpit" />
        <FormInputField form={form} name="aroundArmToWrist1" />
        <FormInputField form={form} name="aroundArmToWrist2" />
        <FormInputField form={form} name="aroundArmToWrist3" />
        <FormInputField form={form} name="armLength1" />
        <FormInputField form={form} name="armLength2" />
        <FormInputField form={form} name="aroundThickToAnkle" />
        <FormInputField form={form} name="trousersLength" />
        <FormInputField form={form} name="chestHeight" />
        <FormInputField form={form} name="chestWidth" />
        <FormInputField form={form} name="waist" />
        <FormInputField form={form} name="hips" />
        <FormInputField form={form} name="shoulder" />
        <FormInputField form={form} name="frontShoulder" />
        <FormInputField form={form} name="backShoulder" />
        <FormInputField form={form} name="crotch" />
        <FormInputField form={form} name="braSize" />
        <FormInputField form={form} name="suitDressSize" />
        <FormInputField form={form} name="hairColor" />
        <FormInputField form={form} name="eyeColor" />

        {/* <FormInputField form={form} name="tattoos" />
              <FormInputField form={form} name="scars" /> */}
        <Button className="mt-6" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
