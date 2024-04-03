import * as db from "@prisma/client"
import { PaginatedDataQuery } from "./pagingated-data-type.js"
export type ModelApplication = db.ModelApplication & {
    experiences: db.ModelApplicationExperience[]
    images: db.ModelApplicationImage[]
}

export type ModelApplicationStatus = db.ModelApplicationStatus

export const ModelApplicationStatus = db.ModelApplicationStatus

export type ModelApplicationExperienceCreateInput = db.Prisma.ModelApplicationExperienceCreateWithoutApplicationInput

export type ModelApplicationCreateInput = Omit<db.Prisma.ModelApplicationCreateInput, "images" | "status" | "experiences"> & {
    experiences?: ModelApplicationExperienceCreateInput[]
}


export const ModelApplicationFields = db.Prisma.ModelApplicationScalarFieldEnum

export type ModelApplicationFields = keyof typeof ModelApplicationFields

export type ModelApplicationGetQuery = {
    q?: string,
    from?: Date,
    to?: Date,
    status?: ModelApplicationStatus,

} & PaginatedDataQuery<ModelApplicationFields>

