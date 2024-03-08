import type {
    ModelApplicationStatus as _ModelApplicationStatus,
    Prisma,
    ModelApplication as _ModelApplication,
    ModelApplicationExperience,
    ModelApplicationImage,
} from "@prisma/client";
import { File } from "./file";


export type ModelApplication = _ModelApplication & {
    experiences: ModelApplicationExperience[];
    images: ModelApplicationImage[];
};

export type CreateModelApplicationImageInput = {
    path: string;
    type: string;
}

export type CreateModelApplicationInput = Omit<
    Prisma.ModelApplicationCreateInput,
    "experiences" | "images" | "createdAt" | "updatedAt" | "status" | "talents"
> & {
    talents?: string[]
    experiences?: Prisma.ModelApplicationExperienceCreateWithoutApplicationInput[];
    images?: CreateModelApplicationImageInput[];
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
