import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffUpdatePasswordInput } from "@jimmodel/shared";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";
import { useUpdateStaffPassword } from "../../../hooks/staff/useUpdateStaffPassword";
import { Alert, AlertDescription } from "../../ui/alert";

const UpdateStaffPasswordFormSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "password do not match",
    path: ["confirmPassword"],
  });

type UpdateStaffPasswordFormProps = {
  updateFn: (payload: StaffUpdatePasswordInput) => Promise<void>;
};

export default function UpdateStaffPasswordForm({
  updateFn,
}: UpdateStaffPasswordFormProps) {
  const form = useForm<z.infer<typeof UpdateStaffPasswordFormSchema>>({
    resolver: zodResolver(UpdateStaffPasswordFormSchema),
  });
  
  const {toast} = useToast()

  const {update, isPending, error} = useUpdateStaffPassword({
    updateFn: updateFn,
    onSuccess: () => {
      toast({title: "Successfully updated staff password"})
      form.reset({password: "", confirmPassword: ""})
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        onSubmit={form.handleSubmit((data) => update({newPassword: data.password}))}
      >
          <div className="col-span-2">
        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
          
             <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
  )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2">
            <Button disabled={isPending}>Update Password</Button>
        </div>
      </form>
    </Form>
  );
}
