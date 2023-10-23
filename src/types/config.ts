import { type z } from "zod";
import { type ConfigSchema } from "../validators/config";

export type AppConfig = z.infer<typeof ConfigSchema>;
