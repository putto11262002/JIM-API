import { type Prisma } from "@prisma/client";

export type CreateStaffInput = Omit<
    Prisma.StaffCreateInput,
    "id" | "createdAt" | "updatedAt"
>;
