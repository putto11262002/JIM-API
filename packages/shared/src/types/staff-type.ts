import * as db from "@prisma/client"
import { StaffGetQuerySchema as StaffGetQuerySchema, StaffCreateSchema as StaffCreateSchema, StaffLoginSchema, StaffUpdatePasswordSchema, StaffUpdateSchema, StaffRefreshTokenSchema } from "../schemas/staff-scehma.js"
import z from "zod"
import { PaginatedData, PaginatedDataQuery } from "./pagingated-data-type.js"
export type Staff = db.Staff
export type StaffWithoutSecrets = Omit<Staff, "password" | "logout">
export type StaffRole = db.StaffRole
export const StaffRole = db.StaffRole


export type StaffCreateInput = db.Prisma.StaffCreateInput;


export type  StaffLoginInput = {
    usernameOrEmail: string;
    password: string;
}

export type StaffLoginResult = {
    accessToken: string;
    refreshToken: string;
    staff: StaffWithoutSecrets;
}

export type StaffUpdateInput = Omit<db.Prisma.StaffUpdateInput, "jobs">

export type StaffUpdatePasswordInput = {
    newPassword: string
}

export type StaffFeilds = keyof typeof db.Prisma.StaffScalarFieldEnum

export const StaffFields = db.Prisma.StaffScalarFieldEnum

export type StaffGetQuery = {
    q?: string;
    roles?: StaffRole[];

} & PaginatedDataQuery<StaffFeilds>

export type StaffRefreshTokenInput = z.infer<typeof StaffRefreshTokenSchema>