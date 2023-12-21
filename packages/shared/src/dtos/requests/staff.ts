import { z } from "zod";
import { StaffLoginSchema } from "../../validators";

export type StaffLoginDTO = z.infer<typeof StaffLoginSchema>;