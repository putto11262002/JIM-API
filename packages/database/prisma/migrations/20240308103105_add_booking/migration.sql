-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "personIncharge" TEXT NOT NULL,
    "mediaReleased" TEXT NOT NULL,
    "periodReleased" TEXT NOT NULL,
    "territoriesReleased" TEXT NOT NULL,
    "shootingStart" TIMESTAMP(3) NOT NULL,
    "shootingEnd" TIMESTAMP(3) NOT NULL,
    "fittingDate" TIMESTAMP(3) NOT NULL,
    "workingHour" TEXT NOT NULL,
    "venueOfShoot" TEXT NOT NULL,
    "feeAsAgreed" TEXT NOT NULL,
    "overtimePerHour" TEXT NOT NULL,
    "termsOfPayment" TEXT NOT NULL,
    "cancellationFee" TEXT NOT NULL,
    "contractDetails" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "bookedById" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToModel_AB_unique" ON "_BookingToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToModel_B_index" ON "_BookingToModel"("B");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookedById_fkey" FOREIGN KEY ("bookedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToModel" ADD CONSTRAINT "_BookingToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToModel" ADD CONSTRAINT "_BookingToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
