import { z } from "zod";
import { CalendarGetQuery, CalendarMode } from "../types";
import { schemaForType } from "../utils";

export const CalendarGetQuerySchema = schemaForType<CalendarGetQuery>()(
    z.object({
        mode: z.nativeEnum(CalendarMode).optional(),
        date: z.date().or(z.string().datetime({offset: true}).transform(v => new Date(v))).optional()
    })
)