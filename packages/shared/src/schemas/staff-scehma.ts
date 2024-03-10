import { Prisma, StaffRole } from "@prisma/client";
import z from "zod"
import { PaginatedQuerySchema } from "./paginated-data";


export const StaffCreateSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email("invalid email"),
    username: z.string().min(6, "must contain at least 6 characters").max(50),
    password: z.string().min(8).max(50),
    role: z.nativeEnum(StaffRole).optional(),
});


export const StaffLoginSchema = z.object({
    usernameOrEmail: z.string().min(1, "username or email is required"),
    password: z.string().min(1, "password is required"),
});


export const StaffRefreshTokenSchema = z.object({
    token: z.string({required_error: "token is required"}).min(1, "token is required"),
})


export const StaffUpdateSchema = z.object({
    firstName: z.string().min(1).max(255).optional(),
    lastName: z.string().min(1).max(255).optional(),
    role: z.nativeEnum(StaffRole).optional()
})

export const StaffGetQuerySchema = z.object({
    q: z.string().optional(),
    roles: z.array(z.nativeEnum(StaffRole)).or(z.string().transform((val, ctx) => {
        if (!val) return undefined
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
    })).optional(),
    sortBy: z
        .nativeEnum(Prisma.StaffScalarFieldEnum)
        .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: PaginatedQuerySchema.shape.page,
    pageSize: PaginatedQuerySchema.shape.pageSize,
   
})



export const StaffUpdatePasswordSchema = z.object({
    newPassword: z.string().min(8).max(50),
    // oldPassword: z.string().min(8).max(50), 
})







