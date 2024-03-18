/*
  Warnings:

  - The values [ACCEPTED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fittingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `shootingEnd` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `shootingStart` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `shootingEndDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'ARCHIVED', 'CANCELED');
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "fittingDate",
DROP COLUMN "shootingEnd",
DROP COLUMN "shootingStart",
ADD COLUMN     "finalMeetingDate" TIMESTAMP(3),
ADD COLUMN     "fittingEndDate" TIMESTAMP(3),
ADD COLUMN     "fittingStartDate" TIMESTAMP(3),
ADD COLUMN     "shootingEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "shootingStartDate" TIMESTAMP(3),
ALTER COLUMN "clientAddress" DROP NOT NULL,
ALTER COLUMN "personIncharge" DROP NOT NULL,
ALTER COLUMN "mediaReleased" DROP NOT NULL,
ALTER COLUMN "periodReleased" DROP NOT NULL,
ALTER COLUMN "territoriesReleased" DROP NOT NULL,
ALTER COLUMN "workingHour" DROP NOT NULL,
ALTER COLUMN "venueOfShoot" DROP NOT NULL,
ALTER COLUMN "feeAsAgreed" DROP NOT NULL,
ALTER COLUMN "overtimePerHour" DROP NOT NULL,
ALTER COLUMN "termsOfPayment" DROP NOT NULL,
ALTER COLUMN "cancellationFee" DROP NOT NULL,
ALTER COLUMN "contractDetails" DROP NOT NULL;
