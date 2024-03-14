import { z } from "zod";
import { ModelCreateFormSchema } from "../../schemas/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { FormInputField } from "../shared/form/FormInputField";
import { Button } from "../ui/button";

export const ModelAddresSchema = ModelCreateFormSchema.pick({
    address: true,
    city: true,
    region: true,
    zipCode: true,
    country: true
})

export type ModelAddressForm = z.infer<typeof ModelAddresSchema>    


export function ModelAddressForm({onSubmit, initialData}: {onSubmit: (data: ModelAddressForm) => void, initialData?: ModelAddressForm}){
    const form = useForm<ModelAddressForm>({...(initialData ? {defaultValues: initialData} : {}) , resolver: zodResolver(ModelAddresSchema)})
    return <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <FormInputField form={form} name="address" />
              <FormInputField form={form} name="city" />
              <FormInputField form={form} name="region" />
              <FormInputField form={form} name="zipCode" />
              <FormInputField form={form} name="country" />
              <Button className="mt-6" type="submit">Save</Button>
            </form>

    </Form>
}