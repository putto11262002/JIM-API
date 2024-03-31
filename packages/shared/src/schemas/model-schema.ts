import z from "zod";
import { PaginatedQuerySchema } from "./paginated-data.js";
import { schemaForType } from "../utils/zod.js";
import {
  EncodedModelGetQuery,
  ModelCreateInput,
  ModelExperienceCreateInput,
  ModelGetQuery,
  ModelUpdateInput,
} from "../types/index.js";

export const ModelCreateSchema = schemaForType<ModelCreateInput>()(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickname: z.string().optional(),
    phoneNumber: z.string(),
    email: z.string().email(),
    lineId: z.string().optional(),
    whatsapp: z.string().optional(),
    wechat: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    dateOfBirth: z.date().or(z.string().datetime({ offset: false })),
    gender: z.string(),
    nationality: z.string().optional(),
    ethnicity: z.string().optional(),
    countryOfResidence: z.string().optional(),
    spokenLanguages: z.array(z.string()).optional(),
    passportNumber: z.string().optional(),
    idCardNumber: z.string().optional(),
    taxId: z.string().optional(),
    occupation: z.string().optional(),
    highestLevelOfEducation: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    talents: z.array(z.string()).optional(),
    aboutMe: z.string().optional(),
    medicalBackground: z.string().optional(),
    tattoos: z.string().optional(),
    scars: z.string().optional(),
    underwareShooting: z.boolean().optional(),
    inTown: z.boolean().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhoneNumber: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    height: z.string(),
    weight: z.string(),
    bust: z.string().optional(),
    collar: z.string().optional(),
    aroundArmpit: z.string().optional(),
    aroundArmToWrist1: z.string().optional(),
    aroundArmToWrist2: z.string().optional(),
    aroundArmToWrist3: z.string().optional(),
    armLength1: z.string().optional(),
    armLength2: z.string().optional(),
    aroundThickToAnkle: z.string().optional(),
    trousersLength: z.string().optional(),
    chestHeight: z.string().optional(),
    chestWidth: z.string().optional(),
    waist: z.string().optional(),
    hips: z.string().optional(),
    shoulder: z.string().optional(),
    frontShoulder: z.string().optional(),
    backShoulder: z.string().optional(),
    crotch: z.string().optional(),
    braSize: z.string().optional(),
    suitDressSize: z.string().optional(),
    shoeSize: z.string().optional(),
    hairColor: z.string().optional(),
    eyeColor: z.string().optional(),
  })
);

export const ModelUpdateSchema = schemaForType<ModelUpdateInput>()(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nickname: z.string().optional().nullable(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    lineId: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    wechat: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    dateOfBirth: z.string().datetime({ offset: false }).optional(),
    gender: z.string().optional(),
    nationality: z.string().optional().nullable(),
    ethnicity: z.string().optional().nullable(),
    countryOfResidence: z.string().optional().nullable(),
    spokenLanguages: z.array(z.string()).optional(),
    passportNumber: z.string().optional().nullable(),
    idCardNumber: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    highestLevelOfEducation: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    talents: z.array(z.string()).optional(),
    aboutMe: z.string().optional().nullable(),
    medicalBackground: z.string().optional().nullable(),
    tattoos: z.string().optional().nullable(),
    scars: z.string().optional().nullable(),
    underwareShooting: z.boolean().optional().nullable(),
    inTown: z.boolean().optional().nullable(),
    emergencyContactName: z.string().optional().nullable(),
    emergencyContactNumber: z.string().optional().nullable(),
    emergencyContactRelationship: z.string().optional().nullable(),
    height: z.string().optional(),
    weight: z.string().optional(),
    bust: z.string().optional().nullable(),
    collar: z.string().optional().nullable(),
    aroundArmpit: z.string().optional().nullable(),
    aroundArmToWrist1: z.string().optional().nullable(),
    aroundArmToWrist2: z.string().optional().nullable(),
    aroundArmToWrist3: z.string().optional().nullable(),
    armLength1: z.string().optional().nullable(),
    armLength2: z.string().optional().nullable(),
    aroundThickToAnkle: z.string().optional().nullable(),
    trousersLength: z.string().optional().nullable(),
    chestHeight: z.string().optional().nullable(),
    chestWidth: z.string().optional().nullable(),
    waist: z.string().optional().nullable(),
    hips: z.string().optional().nullable(),
    shoulder: z.string().optional().nullable(),
    frontShoulder: z.string().optional().nullable(),
    backShoulder: z.string().optional().nullable(),
    crotch: z.string().optional().nullable(),
    braSize: z.string().optional().nullable(),
    suitDressSize: z.string().optional().nullable(),
    shoeSize: z.string().optional().nullable(),
    hairColor: z.string().optional().nullable(),
    eyeColor: z.string().optional().nullable(),
  })
);

export const ModelExperienceCreateSchema =
  schemaForType<ModelExperienceCreateInput>()(
    z.object({
      year: z.string(),
      media: z.string(),
      country: z.string(),
      product: z.string(),
      details: z.string().optional(),
    })
  );

export const CreateModelImageSchema = z.object({
  type: z.string(),
});

// export const EncodeGetModelQuerySchema = schemaForType<EncodedModelGetQuery>()(
//   z.object({
//     q: z.string().optional(),
//     order: z.string(),
//     page: z.string().optional(),
//     pageSize: z.number().transform((val) => val.toString()).or(z.string()).optional()
//     })
// )

export const DecodeGetModelQuerySchema = schemaForType<ModelGetQuery>()(
  z.object({
    page: PaginatedQuerySchema.shape.page,
    pageSize: PaginatedQuerySchema.shape.pageSize,
    q: z.string().optional(),
    order: z
      .string()
      .transform((val, ctx) => {
        if (val === undefined) {
          return undefined;
        }

        const parts = val.split(":");
        const orderByfield = parts.shift();
        let orderDir = parts.shift();
        if (orderByfield === undefined) {
          return undefined;
        }

        if (orderDir !== "asc" && orderDir !== "desc") {
          orderDir = undefined;
        }

        const order: { [key: string]: "asc" | "desc" | undefined } = {
          [orderByfield]: orderDir,
        };

        return order;
      })
      .optional(),
  })
);


export const ModelSetProfileImageSchema = z.object({
  imageId: z.string(),
});
