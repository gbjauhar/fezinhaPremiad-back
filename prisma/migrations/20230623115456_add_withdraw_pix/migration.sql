/*
  Warnings:

  - Added the required column `pix` to the `withdraws` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "withdraws" ADD COLUMN     "pix" TEXT NOT NULL;
