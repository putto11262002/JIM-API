import type { Prisma, Model as _Model } from "@prisma/client";
export type CreateModelInput = {
    firstName: string;
    lastName: string;
};

export type Model = _Model;

export type ModelQuery = {
    q?: string;
};

export type CreateModelExperienceInput = Prisma.ModelExperienceCreateInput;

export type UpdateModelInput = Prisma.ModelUpdateInput;
