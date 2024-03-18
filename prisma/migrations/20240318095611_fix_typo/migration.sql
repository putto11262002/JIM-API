-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_blockId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_jobId_fkey";

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
