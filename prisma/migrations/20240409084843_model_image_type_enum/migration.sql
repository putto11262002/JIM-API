/*
  Warnings:

  - Changed the type of `type` on the `ModelImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ModelImageType" AS ENUM ('POLAROID', 'BOOK', 'COMPOSITE');

-- AlterTable
ALTER TABLE "ModelImage" DROP COLUMN "type",
ADD COLUMN     "type" "ModelImageType" NOT NULL;
