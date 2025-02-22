/*
  Warnings:

  - Added the required column `tracking_number` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "tracking_number" TEXT NOT NULL;
