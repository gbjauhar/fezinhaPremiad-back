/*
  Warnings:

  - You are about to drop the column `payment_id` on the `titles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "titles" DROP CONSTRAINT "titles_payment_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "titles" DROP COLUMN "payment_id";
