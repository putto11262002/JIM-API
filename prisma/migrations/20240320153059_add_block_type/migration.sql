/*
  Warnings:

  - You are about to drop the column `jobId` on the `Model` table. All the data in the column will be lost.
  - Added the required column `type` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "jobId";
