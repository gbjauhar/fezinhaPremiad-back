/*
  Warnings:

  - Added the required column `qr_code` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "qr_code" TEXT NOT NULL;
