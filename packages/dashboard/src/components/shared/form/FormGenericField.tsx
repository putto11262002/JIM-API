import { ComponentProps } from "react";
import { FieldValues, UseFormReturn,   Path, FieldPath, FieldArrayPath } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "../../ui/form";

function getLabelFromName(s: string) {
  const lastField = s.split(".").pop() || "";
  // split camelCase with numbers
  const splited = lastField.replace(/([a-z])([A-Z0-9])/g, "$1 $2");
  // const splited = lastField.replace(/([a-z])([A-Z])/g, "$1 $2");
  // capitalize all words
  return splited.charAt(0).toUpperCase() + splited.slice(1);
}

export type FormGenericFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  render: ComponentProps<typeof FormField<T>>["render"];
  className?: string;
};
export function FormGenericField<T extends FieldValues>({
  label,
  form,
  name,
  description,
  render,
  className
}: FormGenericFieldProps<T>) {
  return (
    <FormField
    
      control={form.control}
      name={name}
      render={(arg) => (
        <FormItem className={className}>
          {!(typeof label === "string" && label === "") && <FormLabel>{typeof label === "string" ? label : getLabelFromName(name)}</FormLabel>}
          {render(arg)}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
