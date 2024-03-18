/*
  Warnings:

  - The values [REJECTED] on the enum `ModelApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `fileId` to the `ModelImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModelApplicationStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'ARCHIVED');
ALTER TABLE "ModelApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ModelApplication" ALTER COLUMN "status" TYPE "ModelApplicationStatus_new" USING ("status"::text::"ModelApplicationStatus_new");
ALTER TYPE "ModelApplicationStatus" RENAME TO "ModelApplicationStatus_old";
ALTER TYPE "ModelApplicationStatus_new" RENAME TO "ModelApplicationStatus";
DROP TYPE "ModelApplicationStatus_old";
ALTER TABLE "ModelApplication" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "ModelImage" ADD COLUMN     "fileId" TEXT NOT NULL;
