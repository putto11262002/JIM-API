/*
  Warnings:

  - You are about to drop the column `inTown` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `ModelImage` table. All the data in the column will be lost.
  - You are about to drop the `ModelMeasurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookingToModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `height` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ModelImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModelMeasurement" DROP CONSTRAINT "ModelMeasurement_modelId_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToModel" DROP CONSTRAINT "_BookingToModel_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToModel" DROP CONSTRAINT "_BookingToModel_B_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "inTown",
ADD COLUMN     "armLength1" TEXT,
ADD COLUMN     "armLength2" TEXT,
ADD COLUMN     "aroundArmToWrist1" TEXT,
ADD COLUMN     "aroundArmToWrist2" TEXT,
ADD COLUMN     "aroundArmToWrist3" TEXT,
ADD COLUMN     "aroundArmpit" TEXT,
ADD COLUMN     "aroundThickToAnkle" TEXT,
ADD COLUMN     "backLength" TEXT,
ADD COLUMN     "backShoulder" TEXT,
ADD COLUMN     "braSize" TEXT,
ADD COLUMN     "bust" TEXT,
ADD COLUMN     "chestHeight" TEXT,
ADD COLUMN     "chestWidth" TEXT,
ADD COLUMN     "collar" TEXT,
ADD COLUMN     "crotch" TEXT,
ADD COLUMN     "eyeColor" TEXT,
ADD COLUMN     "frontLength" TEXT,
ADD COLUMN     "frontShoulder" TEXT,
ADD COLUMN     "hairColor" TEXT,
ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "hips" TEXT,
ADD COLUMN     "shoeSize" TEXT,
ADD COLUMN     "shoulder" TEXT,
ADD COLUMN     "suitDressSize" TEXT,
ADD COLUMN     "trousersLength" TEXT,
ADD COLUMN     "waist" TEXT,
ADD COLUMN     "weight" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ModelImage" DROP COLUMN "tag",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "ModelMeasurement";

-- DropTable
DROP TABLE "_BookingToModel";
