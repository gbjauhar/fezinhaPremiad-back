/*
  Warnings:

  - Changed the type of `deposit_type` on the `value_histories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "value_histories" DROP COLUMN "deposit_type",
ADD COLUMN     "deposit_type" TEXT NOT NULL;
