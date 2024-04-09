/*
  Warnings:

  - Added the required column `height` to the `ModelApplicationImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ModelApplicationImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `ModelImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ModelImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelApplicationImage" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ModelImage" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
