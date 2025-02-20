-- DropForeignKey
ALTER TABLE "status_history" DROP CONSTRAINT "status_history_parcelId_fkey";

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
