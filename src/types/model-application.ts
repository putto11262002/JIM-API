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

export type CreateModelApplicationInput = Prisma.ModelApplicationCreateInput;

export type ModelApplicationQuery = {
    q?: string;
    status?: ModelApplicationStatus;
    from?: Date;
    to?: Date;
    page?: number;
    pageSize?: number;
};

export type ModelApplicationStatus = _ModelApplicationStatus;
