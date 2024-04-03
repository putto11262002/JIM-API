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
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Alert, AlertDescription } from "../../ui/alert";
import { useUpdateStaffPassword } from "../../../hooks/staff/use-update-staff-password";

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
  staffId: string
};

export default function UpdateStaffPasswordForm({
staffId
}: UpdateStaffPasswordFormProps) {
  const form = useForm<z.infer<typeof UpdateStaffPasswordFormSchema>>({
    resolver: zodResolver(UpdateStaffPasswordFormSchema),
  });

const {update, error, status} = useUpdateStaffPassword()

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        onSubmit={form.handleSubmit((data) =>
          update({ payload: {newPassword: data.password}, id:  staffId})
        )}
      >
        <div className="col-span-2">
          {status === "error" && (
            <Alert variant="destructive" className="my-3">
              <AlertDescription>{error?.message}</AlertDescription>
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
          <Button disabled={status === "pending"}>Update Password</Button>
        </div>
      </form>
    </Form>
  );
}
