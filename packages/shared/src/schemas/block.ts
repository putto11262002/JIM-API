import { z } from "zod";
import { BlockCreateInput } from "../types";
import { schemaForType } from "../utils";

export const BlockCreateSchema = schemaForType<BlockCreateInput>()(
  z.object({
    start: z.date().or(z.string().datetime({ offset: false }).transform(v => new Date(v))),
    end: z.date().or(z.string().datetime({ offset: false }).transform(v => new Date(v))),
    reason: z.string().optional(),
    type: z.string(),
    modelIds: z.array(z.string())
  })
)
