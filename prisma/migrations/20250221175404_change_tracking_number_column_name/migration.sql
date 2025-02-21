/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `parcels` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tracking_number]` on the table `parcels` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tracking_number` to the `parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "parcels_trackingNumber_key";

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "trackingNumber",
ADD COLUMN     "tracking_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parcels_tracking_number_key" ON "parcels"("tracking_number");
