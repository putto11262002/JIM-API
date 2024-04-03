import {  FieldValues } from "react-hook-form";
import { FormGenericField, FormGenericFieldProps } from "./FormGenericField";
import { FormControl } from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { ComponentProps } from "react";


export function FormTextareaField<T extends FieldValues>({
    ...props
}: Omit<FormGenericFieldProps<T>, "render"> & {textareaProps?:  ComponentProps<typeof Textarea>}) {
    return <FormGenericField {...props} render={({field}) => (
        <FormControl>
            <Textarea  {...props.textareaProps} {...field} value={field.value ?? ""}/>
        </FormControl>
    )}/>
}