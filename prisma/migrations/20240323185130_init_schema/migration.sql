-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STAFF_ROOT', 'STAFF_ADMIN', 'STAFF_GENERAL');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'GENERAL', 'ROOT');

-- CreateEnum
CREATE TYPE "ModelApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ARCHIVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "logout" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelApplicationExperience" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "details" TEXT,

    CONSTRAINT "ModelApplicationExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelApplicationImage" (
    "fileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT,
    "url" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelApplicationImage_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "ModelApplication" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lineId" TEXT,
    "wechat" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "whatsapp" TEXT,
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
    "aboutMe" TEXT,
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
CREATE TABLE "ModelImage" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelExperience" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "details" TEXT,

    CONSTRAINT "ModelExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lineId" TEXT,
    "whatsapp" TEXT,
    "wechat" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT,
    "ethnicity" TEXT,
    "countryOfResidence" TEXT,
    "spokenLanguages" TEXT[],
    "passportNumber" TEXT,
    "idCardNumber" TEXT,
    "taxId" TEXT,
    "occupation" TEXT,
    "highestLevelOfEducation" TEXT,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "talents" TEXT[],
    "aboutMe" TEXT,
    "medicalBackground" TEXT,
    "tattoos" TEXT,
    "scars" TEXT,
    "underwareShooting" BOOLEAN,
    "emergencyContactName" TEXT,
    "emergencyContactPhoneNumber" TEXT,
    "emergencyContactRelationship" TEXT,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "bust" TEXT,
    "collar" TEXT,
    "aroundArmpit" TEXT,
    "aroundArmToWrist1" TEXT,
    "aroundArmToWrist2" TEXT,
    "aroundArmToWrist3" TEXT,
    "armLength1" TEXT,
    "armLength2" TEXT,
    "aroundThickToAnkle" TEXT,
    "trousersLength" TEXT,
    "chestHeight" TEXT,
    "chestWidth" TEXT,
    "waist" TEXT,
    "hips" TEXT,
    "shoulder" TEXT,
    "frontShoulder" TEXT,
    "frontLength" TEXT,
    "backShoulder" TEXT,
    "backLength" TEXT,
    "crotch" TEXT,
    "braSize" TEXT,
    "suitDressSize" TEXT,
    "shoeSize" TEXT,
    "hairColor" TEXT,
    "eyeColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileMetaData" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "clientAddress" TEXT,
    "personInCharge" TEXT,
    "mediaReleased" TEXT,
    "periodReleased" TEXT,
    "territoriesReleased" TEXT,
    "workingHour" TEXT,
    "venueOfShoot" TEXT,
    "feeAsAgreed" TEXT,
    "overtimePerHour" TEXT,
    "termsOfPayment" TEXT,
    "cancellationFee" TEXT,
    "contractDetails" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "JobStatus" NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JobToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToModel_AB_unique" ON "_BookingToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToModel_B_index" ON "_BookingToModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JobToModel_AB_unique" ON "_JobToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToModel_B_index" ON "_JobToModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockToModel_AB_unique" ON "_BlockToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockToModel_B_index" ON "_BlockToModel"("B");

-- AddForeignKey
ALTER TABLE "ModelApplicationExperience" ADD CONSTRAINT "ModelApplicationExperience_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ModelApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelApplicationImage" ADD CONSTRAINT "ModelApplicationImage_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ModelApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelImage" ADD CONSTRAINT "ModelImage_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelExperience" ADD CONSTRAINT "ModelExperience_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToModel" ADD CONSTRAINT "_BookingToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToModel" ADD CONSTRAINT "_BookingToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToModel" ADD CONSTRAINT "_JobToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToModel" ADD CONSTRAINT "_JobToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockToModel" ADD CONSTRAINT "_BlockToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockToModel" ADD CONSTRAINT "_BlockToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
