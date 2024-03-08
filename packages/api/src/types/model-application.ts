import type {
    ModelApplicationStatus as _ModelApplicationStatus,
    Prisma,
    ModelApplication as _ModelApplication,
    ModelApplicationExperience,
    ModelApplicationImage,
} from "@prisma/client";

export type ModelApplication = _ModelApplication & {
    experiences: ModelApplicationExperience[];
    images: ModelApplicationImage[];
};

export type CreateModelApplicationInput = Omit<
    Prisma.ModelApplicationCreateInput,
    "experiences" | "images" | "createdAt" | "updatedAt" | "status" | "talents"
> & {
    talents?: string[]
    experiences?: Prisma.ModelApplicationExperienceCreateWithoutApplicationInput[];
    images?: Prisma.ModelApplicationImageCreateWithoutApplicationInput[];
};

export type ModelApplicationQuery = {
    q?: string;
    status?: ModelApplicationStatus;
    from?: Date;
    to?: Date;
    page?: number;
    pageSize?: number;
};

export type ModelApplicationStatus = _ModelApplicationStatus;
