-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[];
