import {Prisma} from "@prisma/client"
import { z } from "zod";

export const CreateStaffSchema = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    email: z.string().email(),
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    role: z.enum(["ADMIN", "SCOUT", "BOOKER"]),
});

export const StaffLoginSchema = z.object({
    usernameOrEmail: z.string().min(1, "usernameOrEmail is required"),
    password: z.string().min(1, "password is required"),
});

export const StaffQuerySchema = z.object({
    q: z.string().optional(),
    roles: z.array(z.enum(["ADMIN", "SCOUT", "BOOKER"])).optional(),
    sortBy: z
        .nativeEnum(Prisma.StaffScalarFieldEnum)
        .optional()
        .default("username"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    pageSize: z
        .number()
        .or(z.string())
        .optional()
        .transform((val, ctx) => {
            const defaultVal = 10;
            if (typeof val === "undefined") return defaultVal;

            if (typeof val === "number") return val;

            const parsed = parseInt(val, 10);

            if (isNaN(parsed)) {
                return defaultVal;
            }
            return parsed;
        }),
    page: z
        .number()
        .or(z.string())
        .optional()
        .transform((val, ctx) => {
            const defaultVal = 0;
            if (typeof val === "undefined") return defaultVal;

            if (typeof val === "number") return val;

            const parsed = parseInt(val, 10);

            if (isNaN(parsed)) {
                return defaultVal;
            }
            return parsed;
        }),
});

export const StaffRefreshTokenSchema = z.object({
    token: z.string({required_error: "token is required"}).min(1, "token is required"),
})
