/*
  Warnings:

  - You are about to drop the column `weChat` on the `ModelApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ModelApplication" DROP COLUMN "weChat",
ADD COLUMN     "wechat" TEXT;
