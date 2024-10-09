-- AlterTable
ALTER TABLE "buyed_titles" ADD COLUMN     "seller_title_id" TEXT;

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_seller_title_id_fkey" FOREIGN KEY ("seller_title_id") REFERENCES "selled_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
