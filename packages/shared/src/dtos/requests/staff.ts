import { z } from "zod";
import { StaffLoginSchema, StaffRefreshTokenSchema } from "../../validators";

export type StaffLoginDTO = z.infer<typeof StaffLoginSchema>;

export type StaffRefreshTokenDTO  = z.infer<typeof StaffRefreshTokenSchema>