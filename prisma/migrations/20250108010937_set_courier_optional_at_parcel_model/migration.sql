/*
  Warnings:

  - You are about to drop the column `courierId` on the `parcels` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_courierId_fkey";

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "courierId",
ADD COLUMN     "courier_id" TEXT,
ALTER COLUMN "currentStatus" SET DEFAULT 'ORDER_CREATED';

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
