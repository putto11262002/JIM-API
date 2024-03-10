import { Staff as _Staff, StaffRole as _StaffRole } from "@prisma/client"
import { StaffGetQuerySchema as StaffGetQuerySchema, StaffCreateSchema as StaffCreateSchema, StaffLoginSchema, StaffUpdatePasswordSchema, StaffUpdateSchema } from "../schemas/staff-scehma"
import z, { TypeOf } from "zod"
export type Staff = _Staff
export type StaffWithoutSecrets = Omit<Staff, "password" | "logout">
export type StaffRole = _StaffRole
export const StaffRole = _StaffRole


export type StaffCreateInput = z.infer<typeof StaffCreateSchema>;


export type  StaffLoginInput = z.infer<typeof StaffLoginSchema>

export type StaffLoginResult = {
    accessToken: string;
    refreshToken: string;
    staff: StaffWithoutSecrets;
}

export type StaffUpdateInput = z.infer<typeof StaffUpdateSchema>

export type StaffUpdatePasswordInput = z.infer<typeof StaffUpdatePasswordSchema>

export type StaffGetQuery = z.infer<typeof StaffGetQuerySchema>