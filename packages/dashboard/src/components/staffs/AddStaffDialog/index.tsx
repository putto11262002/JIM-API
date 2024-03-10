import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
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
import { useToast } from "../../ui/use-toast";
import { Alert, AlertDescription } from "../../ui/alert";
import { CreateStaffFormSchema } from "../../../schemas/staff";
import { useCreateStaff } from "../../../hooks/staff/useCreateStaff";


export default function AddStaffDialog() {
  
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { toast } = useToast();


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

  const {create, error} = useCreateStaff({
    onSuccess: () => {
      form.reset()
      setOpenDialog(false)
      toast({title: "Successfully created staff"})
    },
  })



  return (
    <Dialog open={openDialog}  onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="">
          <Plus className="mr-3" /> Staff
        </Button>
      </DialogTrigger>
      <DialogContent  className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="">Add Staff</DialogTitle>
          <DialogDescription>
            Add a new staff to the application
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <div className="">
          <Form {...form}>
            <form
              className="grid grid-cols-2 gap-2"
              onSubmit={form.handleSubmit((data) => create(data))}
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
