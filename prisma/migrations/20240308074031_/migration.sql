/*
  Warnings:

  - The values [ADMIN,SCOUT,BOOKER,ROOT] on the enum `StaffRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STAFF_ROOT', 'STAFF_ADMIN', 'STAFF_GENERAL');

-- AlterEnum
BEGIN;
CREATE TYPE "StaffRole_new" AS ENUM ('STAFF_ADMIN', 'STAFF_GENERAL', 'STAFF_ROOT');
ALTER TABLE "Staff" ALTER COLUMN "role" TYPE "StaffRole_new" USING ("role"::text::"StaffRole_new");
ALTER TYPE "StaffRole" RENAME TO "StaffRole_old";
ALTER TYPE "StaffRole_new" RENAME TO "StaffRole";
DROP TYPE "StaffRole_old";
COMMIT;
