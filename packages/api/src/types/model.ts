import type {
    ModelExperience,
    ModelImage as _ModelImage,
    Prisma,
    Model as _Model,
} from "@prisma/client";

export type CreateModelInput = Omit<
    Prisma.ModelCreateInput,
    "experiences" | "images"
> & {
    experiences?: Prisma.ModelExperienceCreateWithoutModelInput[];
    images?: Prisma.ModelImageCreateWithoutModelInput[];
    measurements?: Prisma.ModelMeasurementCreateWithoutModelInput;
};

export type Model = Omit<_Model, "experiences" | "images"> & {
    experiences?: ModelExperience[];
    images?: ModelImage[];
};

export type ModelImage = _ModelImage;

export type ModelQuery = {
    q?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
};

export type CreateModelExperienceInput = Prisma.ModelExperienceCreateInput;

export type UpdateModelInput = Omit<
    Prisma.ModelUpdateInput,
    "experiences" | "images" | "measurements"
> & { measurements: Prisma.ModelMeasurementUpdateWithoutModelInput };

export type CreateModelImage = Prisma.ModelImageCreateWithoutModelInput;
