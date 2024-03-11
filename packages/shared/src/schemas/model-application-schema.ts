import { ModelApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { ModelApplicationCreateInput, ModelApplicationExperienceCreateInput, ModelApplicationGetQuery } from '../types';
import { schemaForType } from '../utils/zod';

export const ModelApplicationExperienceCreateSchema = schemaForType<ModelApplicationExperienceCreateInput>()(
    z.object({
        year: z.string(),
        media: z.string(),
        country: z.string(),
        product: z.string(),
        details: z.string().optional()
    })
)

export const ModelApplicationCreateSchema = schemaForType<ModelApplicationCreateInput>()(
    z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
        lineId: z.string().optional(),
        wechat: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        whatsapp: z.string().optional(),
        dateOfBirth: z.string().datetime({offset: false}),
        gender: z.string(),
        nationality: z.string(),
        ethnicity: z.string(),
        address: z.string(),
        city: z.string(),
        region: z.string(),
        zipCode: z.string(),
        country: z.string(),
        experiences: z.array(ModelApplicationExperienceCreateSchema).optional(),
        talents: z.array(z.string()).optional(),
        aboutMe: z.string().optional(),
        height: z.string(),
        weight: z.string(),
        bust: z.string(),
        hips: z.string(),
        suitDressSize: z.string(),
        shoeSize: z.string(),
        eyeColor: z.string(),
        hairColor: z.string(),
    })
)


export const ModelApplicationQuerySchema = schemaForType<ModelApplicationGetQuery>()(
    z.object({
        q: z.string().optional(),
        from: z.string().datetime({offset: false}).optional().transform((v) => v  !== undefined ? new Date(v) : v),
        to: z.string().datetime({offset: false}).optional().transform((v) => v !== undefined ? new Date(v) : v),
        status: z.nativeEnum(ModelApplicationStatus).optional(),
        page: z
        .number()
        .or(z.string())
        .optional()
        .transform((val, ctx) => {
            const defaultVal = undefined;
            if (typeof val === "undefined") return defaultVal;
    
            if (typeof val === "number") return val;
    
            const parsed = parseInt(val, 10);
    
            if (isNaN(parsed)) {
                return defaultVal;
            }
            return parsed;
        }),
        pageSize: z
        .number()
        .or(z.string())
        .optional()
        .transform((val, ctx) => {
            const defaultVal = undefined;
            if (typeof val === "undefined") return defaultVal;
    
            if (typeof val === "number") return val;
    
            const parsed = parseInt(val, 10);
    
            if (isNaN(parsed)) {
                return defaultVal;
            }
            return parsed;
        }),
    })
    
)



