/*
  Warnings:

  - You are about to drop the column `seller_title_id` on the `buyed_titles` table. All the data in the column will be lost.
  - You are about to drop the column `title_id` on the `buyed_titles` table. All the data in the column will be lost.
  - You are about to drop the column `title_id` on the `selled_titles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buyedTitlesId]` on the table `selled_titles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyedTitlesId` to the `selled_titles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "buyed_titles" DROP CONSTRAINT "buyed_titles_seller_title_id_fkey";

-- DropForeignKey
ALTER TABLE "buyed_titles" DROP CONSTRAINT "buyed_titles_title_id_fkey";

-- DropForeignKey
ALTER TABLE "selled_titles" DROP CONSTRAINT "selled_titles_title_id_fkey";

-- AlterTable
ALTER TABLE "buyed_titles" DROP COLUMN "seller_title_id",
DROP COLUMN "title_id";

-- AlterTable
ALTER TABLE "selled_titles" DROP COLUMN "title_id",
ADD COLUMN     "buyedTitlesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "buyed_title_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "selled_titles_buyedTitlesId_key" ON "selled_titles"("buyedTitlesId");

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_buyed_title_id_fkey" FOREIGN KEY ("buyed_title_id") REFERENCES "buyed_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_buyedTitlesId_fkey" FOREIGN KEY ("buyedTitlesId") REFERENCES "buyed_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
