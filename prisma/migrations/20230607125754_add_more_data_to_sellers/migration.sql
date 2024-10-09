/*
  Warnings:

  - Added the required column `payment_form` to the `buyed_titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_form` to the `selled_titles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DONE', 'PENDING', 'CANCEL');

-- AlterTable
ALTER TABLE "buyed_titles" ADD COLUMN     "payment_form" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "selled_titles" ADD COLUMN     "payment_form" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
