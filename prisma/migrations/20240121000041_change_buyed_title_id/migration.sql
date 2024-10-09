/*
  Warnings:

  - You are about to drop the column `buyedTitlesId` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_buyedTitlesId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "buyedTitlesId";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_buyed_title_id_fkey" FOREIGN KEY ("buyed_title_id") REFERENCES "buyed_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
