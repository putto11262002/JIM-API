import * as db from "@prisma/client"
import { StaffGetQuerySchema as StaffGetQuerySchema, StaffCreateSchema as StaffCreateSchema, StaffLoginSchema, StaffUpdatePasswordSchema, StaffUpdateSchema, StaffRefreshTokenSchema } from "../schemas/staff-scehma.js"
import z from "zod"
export type Staff = db.Staff
export type StaffWithoutSecrets = Omit<Staff, "password" | "logout">
export type StaffRole = db.StaffRole
export const StaffRole = db.StaffRole


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

export type StaffRefreshTokenInput = z.infer<typeof StaffRefreshTokenSchema>