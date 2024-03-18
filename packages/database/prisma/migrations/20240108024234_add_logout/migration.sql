/*
  Warnings:

  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ModelImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bust` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eyeColor` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hairColor` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hips` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ModelMeasurement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModelApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_modelId_fkey";

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "countryOfResidence" DROP NOT NULL,
ALTER COLUMN "emergencyContactName" DROP NOT NULL,
ALTER COLUMN "emergencyContactPhoneNumber" DROP NOT NULL,
ALTER COLUMN "emergencyContactRelationship" DROP NOT NULL,
ALTER COLUMN "ethnicity" DROP NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "highestLevelOfEducation" DROP NOT NULL,
ALTER COLUMN "idCardNo" DROP NOT NULL,
ALTER COLUMN "inTown" SET DEFAULT false,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "lineId" DROP NOT NULL,
ALTER COLUMN "medicalBackground" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "occupation" DROP NOT NULL,
ALTER COLUMN "passportNo" DROP NOT NULL,
ALTER COLUMN "scars" DROP NOT NULL,
ALTER COLUMN "spokenLanguage" DROP NOT NULL,
ALTER COLUMN "tattoos" DROP NOT NULL,
ALTER COLUMN "taxId" DROP NOT NULL,
ALTER COLUMN "underwareShooting" DROP NOT NULL,
ALTER COLUMN "weChat" DROP NOT NULL,
ALTER COLUMN "whatsApp" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModelImage" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ModelMeasurement" ADD COLUMN     "armLength1" TEXT,
ADD COLUMN     "armLength2" TEXT,
ADD COLUMN     "aroundArmToWrist1" TEXT,
ADD COLUMN     "aroundArmToWrist2" TEXT,
ADD COLUMN     "aroundArmToWrist3" TEXT,
ADD COLUMN     "aroundArmpit" TEXT,
ADD COLUMN     "aroundThickToAnkle" TEXT,
ADD COLUMN     "backLength" TEXT,
ADD COLUMN     "backShoulder" TEXT,
ADD COLUMN     "braSize" TEXT,
ADD COLUMN     "bust" TEXT NOT NULL,
ADD COLUMN     "chestHeight" TEXT,
ADD COLUMN     "chestWidth" TEXT,
ADD COLUMN     "collar" TEXT,
ADD COLUMN     "crotch" TEXT,
ADD COLUMN     "eyeColor" TEXT NOT NULL,
ADD COLUMN     "frontLength" TEXT,
ADD COLUMN     "frontShoulder" TEXT,
ADD COLUMN     "hairColor" TEXT NOT NULL,
ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "hips" TEXT NOT NULL,
ADD COLUMN     "shoeSize" TEXT,
ADD COLUMN     "shoulder" TEXT,
ADD COLUMN     "suitDressSize" TEXT,
ADD COLUMN     "trousersLength" TEXT,
ADD COLUMN     "waist" TEXT,
ADD COLUMN     "weight" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "logout" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Experience";

-- CreateTable
CREATE TABLE "ModelApplicationExperience" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "media" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "ModelApplicationExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelApplicationImage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelApplicationImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelApplication" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "weChat" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "whatsApp" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "talents" TEXT[],
    "aboutMe" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "bust" TEXT NOT NULL,
    "hips" TEXT NOT NULL,
    "suitDressSize" TEXT NOT NULL,
    "shoeSize" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "hairColor" TEXT NOT NULL,
    "status" "ModelApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelExperience" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "media" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "ModelExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModelApplicationExperience" ADD CONSTRAINT "ModelApplicationExperience_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ModelApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelApplicationImage" ADD CONSTRAINT "ModelApplicationImage_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ModelApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelExperience" ADD CONSTRAINT "ModelExperience_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
