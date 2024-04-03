
import z from "zod"
import { PaginatedQuerySchema } from "./paginated-data.js";
import { OrderDir, StaffCreateInput, StaffFields, StaffGetQuery, StaffLoginInput, StaffRole, StaffUpdateInput, StaffUpdatePasswordInput } from "../types/index.js";
import * as db from "@prisma/client";
import { schemaForType } from "../utils/zod.js";


export const StaffCreateSchema = schemaForType<StaffCreateInput>()(
    z.object({
        firstName: z.string().min(1).max(255),
        lastName: z.string().min(1).max(255),
        email: z.string().email("invalid email"),
        username: z.string().min(6, "must contain at least 6 characters").max(50),
        password: z.string().min(8).max(50),
        role: z.nativeEnum(StaffRole),
        color: z.string(),
    })
)


export const StaffLoginSchema = schemaForType<StaffLoginInput>()(
    z.object({
        usernameOrEmail: z.string().min(1, "username or email is required"),
        password: z.string().min(1, "password is required"),
    })
)


export const StaffRefreshTokenSchema = z.object({
    token: z.string({required_error: "token is required"}).min(1, "token is required"),
})


export const StaffUpdateSchema = schemaForType<StaffUpdateInput>()(
    z.object({
        firstName: z.string().min(1).max(255).optional(),
        lastName: z.string().min(1).max(255).optional(),
        role: z.nativeEnum(StaffRole).optional(),
        color: z.string().optional(),
    })
)

export const StaffGetQuerySchema = schemaForType<StaffGetQuery>()(
    z.object({
        q: z.string().optional(),
        roles: z.string().transform((value, ctx) => {
            const splitedValues =  value.split(",") 
            for (const role of splitedValues) {
                if (!Object.values(StaffRole).includes(role as StaffRole)) {
                    ctx.addIssue({message: `invalid role ${role}`, code: z.ZodIssueCode.custom})
                    return z.NEVER
                }
            }
            return splitedValues as StaffRole[]
        
        }).optional(),
        orderBy: z
            .nativeEnum(StaffFields)
            .optional(),
        orderDir: z.nativeEnum(OrderDir).optional(),
        page: PaginatedQuerySchema.shape.page,
        pageSize: PaginatedQuerySchema.shape.pageSize,
       
    })
)



export const StaffUpdatePasswordSchema = schemaForType<StaffUpdatePasswordInput>()(
    z.object({
        newPassword: z.string().min(8).max(50),
    })    
)






