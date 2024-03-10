import { verifyAccessToken } from "../lib/auth";
import staffService from "../services/staff-service";
import { Staff, StaffRole, StaffWithoutSecrets } from "../types/staff-type";
import { authMiddleware } from "./auth-middleware";

export const staffAuthMiddleware = (...roles: StaffRole[]) =>
  authMiddleware<StaffWithoutSecrets>(
    staffService.getById,
    verifyAccessToken,
    ...roles
  );
