/*
  Warnings:

  - You are about to drop the column `currentStatus` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `streetAddress` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `recipients` table. All the data in the column will be lost.
  - Added the required column `street_address` to the `recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "currentStatus",
ADD COLUMN     "current_status" "Status" NOT NULL DEFAULT 'ORDER_CREATED';

-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "streetAddress",
DROP COLUMN "zipCode",
ADD COLUMN     "street_address" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;
