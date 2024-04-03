import * as db from "@prisma/client";
import { PaginatedDataQuery } from "./pagingated-data-type.js";

export type ModelImage = db.ModelImage;

export type Model = db.Model & {
  images?: ModelImage[];
  experiences?: db.ModelExperience[];
};

export type ModelCreateInput = Omit<
  db.Prisma.ModelCreateInput,
  "experiences" | "images" | "talents" | "name"
> & {
  talents?: string[];
  name?: string;
};

export type ModelUpdateInput = Omit<
  db.Prisma.ModelUpdateInput,
  "experiences" | "images"
> & {
  talents?: string[];
};

export type ModelImageCreateInput = db.Prisma.ModelImageCreateWithoutModelInput;

export type ModelExperienceCreateInput =
  db.Prisma.ModelExperienceCreateWithoutModelInput;

export type EncodedModelGetQuery = {
  q?: string;
  order?: string;
  page?: number;
  pageSize?: number;
};

export type ModelGetQuery = {
  q?: string;
  orderBy?: string;
  orderDir?: "asc" | "desc";
} & PaginatedDataQuery<ModelFields>;

export const ModelFields = db.Prisma.ModelScalarFieldEnum;

export type ModelFields = keyof typeof ModelFields;
