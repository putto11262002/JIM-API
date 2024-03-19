import { verifyAccessToken } from "../lib/auth";
import staffService from "../services/staff-service";
import { StaffRole, StaffWithoutSecrets } from "@jimmodel/shared";
import { authMiddleware } from "./auth-middleware";

export const staffAuthMiddleware = (...roles: StaffRole[]) =>
  authMiddleware<StaffWithoutSecrets>(
    staffService.getById,
    verifyAccessToken,
    ...roles
  );
