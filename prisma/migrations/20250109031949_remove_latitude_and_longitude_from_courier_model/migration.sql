/*
  Warnings:

  - You are about to drop the column `latitude` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `couriers` table. All the data in the column will be lost.
  - The primary key for the `status_history` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "couriers" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "status_history" DROP CONSTRAINT "status_history_pkey",
ADD CONSTRAINT "status_history_pkey" PRIMARY KEY ("parcelId", "date");
