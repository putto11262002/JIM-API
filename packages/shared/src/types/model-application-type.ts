import {ModelApplicationExperience, ModelApplicationImage, Prisma, ModelApplication as _ModelApplication, ModelApplicationStatus as _ModelApplicationStatus} from "@prisma/client"
import { z } from "zod"
import { ModelApplicationCreateSchema, ModelApplicationExperienceCreateSchema } from "../schemas"
import { paginatedDataQuery } from "./pagingated-data-type"
export type ModelApplication = _ModelApplication & {
    experiences: ModelApplicationExperience[]
    images: ModelApplicationImage[]
}

export type ModelApplicationStatus = _ModelApplicationStatus

export const ModelApplicationStatus = _ModelApplicationStatus

export type ModelApplicationExperienceCreateInput = Prisma.ModelApplicationExperienceCreateWithoutApplicationInput

export type ModelApplicationCreateInput = Omit<Prisma.ModelApplicationCreateInput, "images" | "status" | "experiences"> & {
    experiences?: ModelApplicationExperienceCreateInput[]
}

export const ModelApplicationFields = Prisma.ModelApplicationScalarFieldEnum

export type ModelApplicationGetQuery = {
    q?: string,
    from?: Date,
    to?: Date,
    status?: ModelApplicationStatus,

} & paginatedDataQuery

