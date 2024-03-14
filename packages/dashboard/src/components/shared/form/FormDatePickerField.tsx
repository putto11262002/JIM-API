import { FieldValues } from "react-hook-form";
import { FormGenericField, FormGenericFieldProps } from "./FormGenericField";
import { ComponentProps } from "react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormControl } from "../../ui/form";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

export function FormDatePickerField<T extends FieldValues>({
  ...props
}: Omit<FormGenericFieldProps<T>, "render"> & {calendarProps?: ComponentProps<typeof Calendar>}) {
  return (
    <FormGenericField
      {...props}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "pl-3 text-left font-normal w-full",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  dayjs(field.value).format("DD/MM/YYYY")
                ) : (
                  <span>Pick a date</span>
                )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              {...props.calendarProps}
              selected={field.value}
              onSelect={field.onChange}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
