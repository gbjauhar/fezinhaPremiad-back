-- AlterTable
ALTER TABLE "scratch_cards" ADD COLUMN     "edition_id" TEXT,
ADD COLUMN     "title_id" TEXT;

-- AddForeignKey
ALTER TABLE "scratch_cards" ADD CONSTRAINT "scratch_cards_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scratch_cards" ADD CONSTRAINT "scratch_cards_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
