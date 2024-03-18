/*
  Warnings:

  - You are about to drop the column `bookedById` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationFee` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `clientAddress` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `contractDetails` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `feeAsAgreed` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `finalMeetingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `fittingEndDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `fittingStartDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `mediaReleased` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `overtimePerHour` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `periodReleased` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `personIncharge` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `shootingEndDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `shootingStartDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `termsOfPayment` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `territoriesReleased` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `venueOfShoot` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `workingHour` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `end` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bookedById_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookedById",
DROP COLUMN "cancellationFee",
DROP COLUMN "client",
DROP COLUMN "clientAddress",
DROP COLUMN "contractDetails",
DROP COLUMN "feeAsAgreed",
DROP COLUMN "finalMeetingDate",
DROP COLUMN "fittingEndDate",
DROP COLUMN "fittingStartDate",
DROP COLUMN "mediaReleased",
DROP COLUMN "overtimePerHour",
DROP COLUMN "periodReleased",
DROP COLUMN "personIncharge",
DROP COLUMN "shootingEndDate",
DROP COLUMN "shootingStartDate",
DROP COLUMN "status",
DROP COLUMN "termsOfPayment",
DROP COLUMN "territoriesReleased",
DROP COLUMN "title",
DROP COLUMN "venueOfShoot",
DROP COLUMN "workingHour",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "cancellationFee" TEXT,
ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "clientAddress" TEXT,
ADD COLUMN     "contractDetails" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "feeAsAgreed" TEXT,
ADD COLUMN     "mediaReleased" TEXT,
ADD COLUMN     "overtimePerHour" TEXT,
ADD COLUMN     "periodReleased" TEXT,
ADD COLUMN     "personIncharge" TEXT,
ADD COLUMN     "termsOfPayment" TEXT,
ADD COLUMN     "territoriesReleased" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venueOfShoot" TEXT,
ADD COLUMN     "workingHour" TEXT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "jobId" TEXT;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
