
import { StaffRole } from "@jimmodel/shared";
import z from "zod"
export const CreateStaffFormSchema = z.object({
    firstName: z.string().min(2, "must contain at least 2 characters").max(255),
    lastName: z.string().min(2, "must contain at least 2 characters").max(255),
    email: z.string().email("invalid email"),
    username: z.string().min(6, "must contain at least 6 characters").max(50),
    password: z.string().min(8).max(50),
    role: z.nativeEnum(StaffRole),
    confirmPassword: z.string().min(1, "comfirm password is required"),
    color: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "password must match",
    path: ["confirmPassword"],
  });


  export const StaffLoginFormSchema = z.object({
    usernameOrEmail: z.string().min(1, "usernameOrEmail is required"),
    password: z.string().min(1, "password is required"),
});
