import { StaffRole } from "@prisma/client";

/**
 * @description Role permission levels. Roles with lower levels have higher privileges.
 * Roles with lower levels can have access to all permissions of roles with higher levels
 */
export const RoleLevels: Record<string, number> = {
    [StaffRole.ADMIN]: 1,
    [StaffRole.BOOKER]: 2,
    [StaffRole.SCOUT]: 2,
};
