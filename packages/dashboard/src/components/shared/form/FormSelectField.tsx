import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { FieldValues } from "react-hook-form";
import { FormControl } from "../../ui/form";
import { FormGenericField, FormGenericFieldProps } from "./FormGenericField";

export type SelectOption = {
    label: string;
    value: string;
}
export function FromSelectField<T extends FieldValues>({
    ...props
  }: Omit<FormGenericFieldProps<T>, "render"> & {
    options: SelectOption[];
  }) {
    return (
      <FormGenericField
        {...props}
        render={({ field }) => (
          <Select name={props.name} onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue   placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }