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
import { UpdateStaffPasswordInput } from "@jimmodel/shared";
import { Input } from "../../ui/input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";
import { errorParser } from "../../../lib/error-parser";
import { useState } from "react";

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
  api: (payload: UpdateStaffPasswordInput) => void;
};

export default function UpdateStaffPasswordForm({
  api,
}: UpdateStaffPasswordFormProps) {
  const form = useForm<z.infer<typeof UpdateStaffPasswordFormSchema>>({
    resolver: zodResolver(UpdateStaffPasswordFormSchema),
  });
  const [errorMesssage, setErrorMessage] = useState<string | null>(null)
  const {toast} = useToast()

  const {mutate: handleUpdatePassword, isPending} = useMutation({
    mutationFn: async (
      formData: z.infer<typeof UpdateStaffPasswordFormSchema>
    ) => api({ password: formData.password }),
    onSuccess: () => {
      toast({title: "Successfully updated staff password"})
      form.reset()
    },
    onError: (err) => {
      console.log(err)
      const appError = errorParser(err)
      setErrorMessage(appError.message)
    }
  });

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        onSubmit={form.handleSubmit((data) => handleUpdatePassword(data))}
      >
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
