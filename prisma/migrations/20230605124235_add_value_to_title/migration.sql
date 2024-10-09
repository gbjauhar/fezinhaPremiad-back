/*
  Warnings:

  - Added the required column `value` to the `titles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
