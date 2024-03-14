/*
  Warnings:

  - You are about to drop the column `type` on the `ModelImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ModelImage" DROP COLUMN "type",
ADD COLUMN     "tag" TEXT;
