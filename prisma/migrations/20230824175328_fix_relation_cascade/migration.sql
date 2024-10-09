/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `fisical_titles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "titles" DROP CONSTRAINT "titles_edition_id_fkey";

-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "fisical_titles_name_key" ON "fisical_titles"("name");

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
