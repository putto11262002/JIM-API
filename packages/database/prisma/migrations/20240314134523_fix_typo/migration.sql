/*
  Warnings:

  - You are about to drop the column `personIncharge` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "personIncharge",
ADD COLUMN     "personInCharge" TEXT;
