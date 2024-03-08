import { zodResolver } from "@hookform/resolvers/zod";
import { StaffRole, StaffWithoutPassword, UpdateStaffInput } from "@jimmodel/shared";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useToast } from "../../ui/use-toast";

type UpdateStaffProfileFormProps = {
  staff: StaffWithoutPassword;
  api: (payload: UpdateStaffInput) => Promise<void>
};

const UpdateStaffProfileFormSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "last name is required"),
  role: z.nativeEnum(StaffRole, { required_error: "staff role is required" }),
});

export default function UpdateStaffProfileForm({
  staff,
  api
}: UpdateStaffProfileFormProps) {
  const form = useForm<z.infer<typeof UpdateStaffProfileFormSchema>>({
    resolver: zodResolver(UpdateStaffProfileFormSchema),
    defaultValues: staff,
  });
  const queryClient = useQueryClient()
  const {toast} = useToast()

  const { mutate: handleUpdateStaff, isPending } = useMutation({
    mutationFn: async (
      payload: z.infer<typeof UpdateStaffProfileFormSchema>
    ) => {
       await api(payload)
    },
    onSuccess: () => {
        toast({title: "Successfully updated staff profile"})
        queryClient.invalidateQueries({queryKey: ["staffs"]})
    }
  });
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-2"
        onSubmit={form.handleSubmit((data) => handleUpdateStaff(data))}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(StaffRole).map((role) => (
                    <SelectItem value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2 col-span-2">
          <Button disabled={isPending} type="submit">Update Profile</Button>
        </div>
      </form>
    </Form>
  );
}
