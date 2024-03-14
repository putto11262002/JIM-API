import z from "zod";
import {
  ModelCreateInput,
  ModelExperienceCreateInput,
  schemaForType,
} from "@jimmodel/shared";

export const ModelCreateFormSchema = schemaForType<
  ModelCreateInput & { experiences?: ModelExperienceCreateInput[] }
>()(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickname: z.string().optional().nullable(),
    phoneNumber: z.string(),
    email: z.string().email(),
    lineId: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    wechat: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    dateOfBirth: z.date().or(z.string().datetime({ offset: false })),
    gender: z.string(),
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
    underwareShooting: z.boolean().optional(),
    inTown: z.boolean().optional(),
    emergencyContactName: z.string().optional().nullable(),
    emergencyContactPhoneNumber: z.string().optional().nullable(),
    emergencyContactRelationship: z.string().optional().nullable(),

    height: z.string(),
    weight: z.string(),
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

    experiences: z
      .array(
        z.object({
          year: z.string(),
          media: z.string(),
          country: z.string(),
          product: z.string(),
          details: z.string().optional().nullable(),
        })
      )
      .optional(),
  })
);
