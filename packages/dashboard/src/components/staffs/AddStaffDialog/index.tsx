import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { DialogHeader } from "../../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StaffRole,
} from "@jimmodel/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios";

import { useToast } from "../../ui/use-toast";
import { errorParser } from "../../../lib/error-parser";
import { Alert, AlertDescription } from "../../ui/alert";
import { CreateStaffFormSchema } from "../../../schemas/staff";





export default function AddStaffDialog() {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof CreateStaffFormSchema>>({
    resolver: zodResolver(CreateStaffFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    },
  });

  const { mutate: handleAddStaff } = useMutation({
    mutationFn: async (formData: z.infer<typeof CreateStaffFormSchema>) => {
      const res = await axiosClient.post("/staffs", formData);
      const data = res.data;
      toast({ title: data.message });
      setOpenDialog(false)
      setErrorMessage(null)
    },
    onError: (err) => {
      const appError = errorParser(err);
      setErrorMessage(appError.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["staffs"]})
    }
  });

  useEffect(() => {
    setErrorMessage(null)
    form.reset()
  }, [openDialog])

  return (
    <Dialog open={openDialog}  onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="">
          <Plus className="mr-3" /> Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="">Add Staff</DialogTitle>
          <DialogDescription>
            Add a new staff to the application
          </DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <Alert variant="destructive" className="my-3">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="">
          <Form {...form}>
            <form
              className="grid grid-cols-2 gap-2"
              onSubmit={form.handleSubmit((data) => handleAddStaff(data))}
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
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Username</FormLabel>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(StaffRole).map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="col-span-2 py-2">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
