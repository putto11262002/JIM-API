/*
  Warnings:

  - Added the required column `address` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryOfResidence` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhoneNumber` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactRelationship` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ethnicity` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facebook` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highestLevelOfEducation` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCardNo` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inTown` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagram` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineId` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalBackground` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passportNo` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scars` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spokenLanguage` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tattoos` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxId` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `underwareShooting` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weChat` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsApp` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "countryOfResidence" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "emergencyContactRelationship" TEXT NOT NULL,
ADD COLUMN     "ethnicity" TEXT NOT NULL,
ADD COLUMN     "facebook" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "highestLevelOfEducation" TEXT NOT NULL,
ADD COLUMN     "idCardNo" TEXT NOT NULL,
ADD COLUMN     "inTown" BOOLEAN NOT NULL,
ADD COLUMN     "instagram" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "lineId" TEXT NOT NULL,
ADD COLUMN     "medicalBackground" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "occupation" TEXT NOT NULL,
ADD COLUMN     "passportNo" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "scars" TEXT NOT NULL,
ADD COLUMN     "spokenLanguage" TEXT NOT NULL,
ADD COLUMN     "talents" TEXT[],
ADD COLUMN     "tattoos" TEXT NOT NULL,
ADD COLUMN     "taxId" TEXT NOT NULL,
ADD COLUMN     "underwareShooting" BOOLEAN NOT NULL,
ADD COLUMN     "weChat" TEXT NOT NULL,
ADD COLUMN     "whatsApp" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelImage" (
    "id" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelMeasurement" (
    "modelId" TEXT NOT NULL,

    CONSTRAINT "ModelMeasurement_pkey" PRIMARY KEY ("modelId")
);

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelImage" ADD CONSTRAINT "ModelImage_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelMeasurement" ADD CONSTRAINT "ModelMeasurement_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
