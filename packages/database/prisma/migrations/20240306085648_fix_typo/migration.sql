/*
  Warnings:

  - You are about to drop the column `whatsApp` on the `ModelApplication` table. All the data in the column will be lost.
  - The primary key for the `ModelApplicationImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `height` on the `ModelApplicationImage` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ModelApplicationImage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `ModelApplicationImage` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `ModelImage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `ModelImage` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `ModelApplicationImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "StaffRole" ADD VALUE 'ROOT';

-- AlterTable
ALTER TABLE "ModelApplication" DROP COLUMN "whatsApp",
ADD COLUMN     "whatsapp" TEXT,
ALTER COLUMN "lineId" DROP NOT NULL,
ALTER COLUMN "weChat" DROP NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "aboutMe" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModelApplicationExperience" ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModelApplicationImage" DROP CONSTRAINT "ModelApplicationImage_pkey",
DROP COLUMN "height",
DROP COLUMN "id",
DROP COLUMN "width",
ADD COLUMN     "fileId" TEXT NOT NULL,
ALTER COLUMN "caption" DROP NOT NULL,
ADD CONSTRAINT "ModelApplicationImage_pkey" PRIMARY KEY ("fileId");

-- AlterTable
ALTER TABLE "ModelExperience" ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModelImage" DROP COLUMN "height",
DROP COLUMN "width",
ALTER COLUMN "caption" DROP NOT NULL;

-- CreateTable
CREATE TABLE "FileMetaData" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileMetaData_pkey" PRIMARY KEY ("id")
);
