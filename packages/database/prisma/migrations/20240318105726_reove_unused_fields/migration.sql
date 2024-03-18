/*
  Warnings:

  - You are about to drop the column `blockId` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `Model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "blockId",
DROP COLUMN "bookingId";
