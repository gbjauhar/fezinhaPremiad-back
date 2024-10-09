-- AlterTable
ALTER TABLE "buyed_titles" ADD COLUMN     "address_city" TEXT,
ADD COLUMN     "address_state" TEXT,
ADD COLUMN     "edition_id" TEXT;

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
