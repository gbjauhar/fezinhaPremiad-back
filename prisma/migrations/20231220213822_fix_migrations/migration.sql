-- DropForeignKey
ALTER TABLE "titles" DROP CONSTRAINT "titles_edition_id_fkey";

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
