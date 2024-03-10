import { Prisma } from "@prisma/client";
import { z } from "zod";

export const PaginatedQuerySchema = z.object({
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
    sortBy: z
        .nativeEnum(Prisma.StaffScalarFieldEnum)
        .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
})