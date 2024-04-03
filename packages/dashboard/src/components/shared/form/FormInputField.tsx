import { FieldValues } from "react-hook-form";
import { FormControl } from "../../ui/form";
import { Input } from "../../ui/input";
import { FormGenericFieldProps, FormGenericField } from "./FormGenericField";
import { ComponentProps } from "react";

export function FormInputField<T extends FieldValues>({
    ...props
   }: Omit<FormGenericFieldProps<T>, "render"> & {inputProps?:  ComponentProps<typeof Input>}) {
     return (
       <FormGenericField {...props} render={({field}) => (
         <FormControl>
           <Input {...props.inputProps} {...field} value={field.value || ""}  />
         </FormControl>
       )}/>
     );
   }