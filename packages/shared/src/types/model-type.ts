import { Prisma, Model as _Model } from "@prisma/client";
import { z } from "zod";
import { ModelCreateSchema } from "../schemas";

export type Model = _Model;


export type ModelCreateInput = Omit<Prisma.ModelCreateInput, "experiences" | "images" | "bookings" | "measurement">  & {
    measurement: Prisma.ModelMeasurementCreateWithoutModelInput
}

export type ModelUpdateInput = Omit<Prisma.ModelUpdateInput, "experiences" | "images" | "bookings" | "measurement">  & {
    measurement?: Prisma.ModelMeasurementUpdateInput
}

export type ModelImageCreateInput = Prisma.ModelImageCreateWithoutModelInput

export type ModelExperienceCreateInput = Prisma.ModelExperienceCreateWithoutModelInput



