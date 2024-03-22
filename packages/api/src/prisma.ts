import * as pkg from "@prisma/client"


const globalForPrisma = globalThis as unknown as { prisma: pkg.PrismaClient };

export const prisma = globalForPrisma.prisma || new pkg.PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
