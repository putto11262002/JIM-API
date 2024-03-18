/*
  Warnings:

  - You are about to drop the column `idCardNo` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `passportNo` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `spokenLanguage` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `weChat` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `whatsApp` on the `Model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "idCardNo",
DROP COLUMN "passportNo",
DROP COLUMN "spokenLanguage",
DROP COLUMN "weChat",
DROP COLUMN "whatsApp",
ADD COLUMN     "idCardNumber" TEXT,
ADD COLUMN     "passportNumber" TEXT,
ADD COLUMN     "spokenLanguages" TEXT[],
ADD COLUMN     "wechat" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "ModelMeasurement" ALTER COLUMN "bust" DROP NOT NULL,
ALTER COLUMN "eyeColor" DROP NOT NULL,
ALTER COLUMN "hairColor" DROP NOT NULL,
ALTER COLUMN "hips" DROP NOT NULL;
