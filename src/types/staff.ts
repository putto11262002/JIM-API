import type { Staff, Prisma } from "@prisma/client";

export type CreateStaffInput = Omit<
    Prisma.StaffCreateInput,
    "id" | "createdAt" | "updatedAt"
>;

export type StaffWithoutPassword = Omit<Staff, "password">;
