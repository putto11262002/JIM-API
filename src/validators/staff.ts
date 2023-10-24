import { z } from "zod";

export const CreateStaffSchema = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    email: z.string().email(),
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    role: z.enum(["ADMIN", "SCOUT", "BOOKER"]),
});
