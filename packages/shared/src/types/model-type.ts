import { ModelExperience, ModelImage as _ModelImage, Prisma, Model as _Model } from "@prisma/client";
import {  paginatedDataQuery } from "./pagingated-data-type";

export type ModelImage = _ModelImage

export type Model = _Model & {
    images?: ModelImage[]
    experiences?: ModelExperience[]
};


export type ModelCreateInput = Omit<Prisma.ModelCreateInput, "experiences" | "images" | "talents" | "name">  & {
    talents?: string[]
    name?: string
}

export type ModelUpdateInput = Omit<Prisma.ModelUpdateInput, "experiences" | "images">  & {
    talents?: string[]
}

export type ModelImageCreateInput = Prisma.ModelImageCreateWithoutModelInput

export type ModelExperienceCreateInput = Prisma.ModelExperienceCreateWithoutModelInput

export type EncodedModelGetQuery = {
    q?: string
    order?: string
    page?: number
    pageSize?: number
}

export type ModelGetQuery = {
    q?: string
    order?: {[key: string]: "asc" | "desc" | undefined}
} & paginatedDataQuery