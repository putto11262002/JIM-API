import { z } from "zod";
import { BlockCreateInput } from "../types/index.js";
import { schemaForType } from "../utils/index.js";

export const BlockCreateSchema = schemaForType<BlockCreateInput>()(
  z.object({
    start: z.date().or(z.string().datetime({ offset: false }).transform(v => new Date(v))),
    end: z.date().or(z.string().datetime({ offset: false }).transform(v => new Date(v))),
    reason: z.string().optional(),
    type: z.string(),
    modelIds: z.array(z.string())
  })
)
