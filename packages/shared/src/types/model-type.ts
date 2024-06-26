import * as db from "@prisma/client";
import { PaginatedDataQuery } from "./pagingated-data-type.js";

export type ModelImage = db.ModelImage;

export type Model = db.Model & {
  images: ModelImage[];
  experiences: db.ModelExperience[];
};

export type ModelCreateInput = Omit<
  db.Prisma.ModelCreateInput,
  "experiences" | "images" | "talents" 
> & {
  talents?: string[];
};

export type ModelUpdateInput = Omit<
  db.Prisma.ModelUpdateInput,
  "experiences" | "images"
> & {
  talents?: string[];
  tags?: string[];
};

export type ModelImageCreateInput = db.Prisma.ModelImageCreateWithoutModelInput;

export type ModelExperienceCreateInput =
  db.Prisma.ModelExperienceCreateWithoutModelInput;

export type EncodedModelGetQuery = {
  q?: string;
  public?: boolean
  order?: string;
  page?: number;
  pageSize?: number;
};

export type ModelGetQuery = {
  q?: string;
  public?: boolean
  orderBy?: string;
  orderDir?: "asc" | "desc";
} & PaginatedDataQuery<ModelFields>;

export const ModelFields = db.Prisma.ModelScalarFieldEnum;

export type ModelFields = keyof typeof ModelFields;

export const ModelImageType = db.ModelImageType;


export type ModelImageType = db.ModelImageType

export const ModelGender =  db.Gender

export type ModelGender = db.Gender

export type ModelImageUpdateTypeInput = {
  type: ModelImageType
}



