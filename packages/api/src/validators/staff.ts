import {Prisma} from "@prisma/client"
import { z } from "zod";
import { StaffRole } from "@jimmodel/shared";

export const CreateStaffSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email("invalid email"),
    username: z.string().min(6, "must contain at least 6 characters").max(50),
    password: z.string().min(8).max(50),
    role: z.enum(["ADMIN", "SCOUT", "BOOKER"]),
});

export const UpdateStaffSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    role: z.nativeEnum(StaffRole)
})

export const UpdateStaffPasswordSchema = z.object({
    password: z.string().min(8).max(50)
})

export const StaffLoginSchema = z.object({
    usernameOrEmail: z.string().min(1, "usernameOrEmail is required"),
    password: z.string().min(1, "password is required"),
});

export const StaffQuerySchema = z.object({
    q: z.string().optional(),
    roles: z.string().transform((val, ctx) => {
        const rolesArr = val.split(",")
        const roles: StaffRole[] = []
        for (const role of rolesArr){
            if (role in StaffRole) {
                roles.push(role as StaffRole)
            }else{
                ctx.addIssue({code: z.ZodIssueCode.custom, path: ['roles'], message: `stuff role must be a comma-separated list of valid roles: ${Object.values(StaffRole).join(", ")}`})
                return z.NEVER
            }
        }
        return roles
    }).optional(),
    sortBy: z
        .nativeEnum(Prisma.StaffScalarFieldEnum)
        .optional()
        .default("updatedAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
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
            const defaultVal = 1;
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
