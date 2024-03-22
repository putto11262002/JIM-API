import { z } from "zod";
import { CalendarGetQuery, CalendarMode } from "../types/index.js";
import { schemaForType } from "../utils/index.js";

export const CalendarGetQuerySchema = schemaForType<CalendarGetQuery>()(
    z.object({
        mode: z.nativeEnum(CalendarMode).optional(),
        date: z.date().or(z.string().datetime({offset: true}).transform(v => new Date(v))).optional()
    })
)