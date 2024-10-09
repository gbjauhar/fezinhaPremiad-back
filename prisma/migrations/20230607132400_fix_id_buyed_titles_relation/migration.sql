/*
  Warnings:

  - You are about to drop the column `buyedTitlesId` on the `selled_titles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buyed_titles_id]` on the table `selled_titles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyed_titles_id` to the `selled_titles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "selled_titles" DROP CONSTRAINT "selled_titles_buyedTitlesId_fkey";

-- DropIndex
DROP INDEX "selled_titles_buyedTitlesId_key";

-- AlterTable
ALTER TABLE "selled_titles" DROP COLUMN "buyedTitlesId",
ADD COLUMN     "buyed_titles_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "selled_titles_buyed_titles_id_key" ON "selled_titles"("buyed_titles_id");

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_buyed_titles_id_fkey" FOREIGN KEY ("buyed_titles_id") REFERENCES "buyed_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
