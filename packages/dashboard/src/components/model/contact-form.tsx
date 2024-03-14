import { z } from "zod";
import { ModelCreateFormSchema } from "../../schemas/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { FormInputField } from "../shared/form/FormInputField";
import { Button } from "../ui/button";
import { Model } from "@jimmodel/shared";

export const ModelContactFormSchema = ModelCreateFormSchema.pick({
    phoneNumber: true,
    email: true,
    lineId: true,
    whatsapp: true,
    wechat: true,
    instagram: true,
    facebook: true,
});

export type ModelContactForm = z.infer<typeof ModelContactFormSchema>;

export function ModelContactForm({
  onSubmit,
  initialData
}: {
  onSubmit: (data: ModelContactForm) => void;
  initialData?: Model;
}) {
  const form = useForm<ModelContactForm>({
    ...(initialData ? { defaultValues: initialData } : {}),
    resolver: zodResolver(ModelContactFormSchema),
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        <FormInputField form={form} name="phoneNumber" />
        <FormInputField form={form} name="email" />
        <FormInputField form={form} name="lineId" />
        <FormInputField form={form} name="whatsapp" />
        <FormInputField form={form} name="wechat" />
        <FormInputField form={form} name="instagram" />
        <FormInputField form={form} name="facebook" />
        <Button className="mt-6" type="submit">Save</Button>
      </form>
    </Form>
  );
}
