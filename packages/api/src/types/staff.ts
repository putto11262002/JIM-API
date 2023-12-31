import type { Staff as _Staff, StaffRole as _StaffRole } from "@prisma/client";

export type StaffRole = _StaffRole;

/**
 * @description Staff domain type
 */
export type Staff = _Staff;

export type StaffWithoutPassword = Omit<Staff, "password">;
