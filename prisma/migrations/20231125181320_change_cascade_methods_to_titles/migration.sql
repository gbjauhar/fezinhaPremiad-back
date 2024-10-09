-- DropForeignKey
ALTER TABLE "buyed_titles" DROP CONSTRAINT "buyed_titles_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "buyed_titles" DROP CONSTRAINT "buyed_titles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "selled_titles" DROP CONSTRAINT "selled_titles_buyed_titles_id_fkey";

-- DropForeignKey
ALTER TABLE "selled_titles" DROP CONSTRAINT "selled_titles_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "titles" DROP CONSTRAINT "titles_buyed_title_id_fkey";

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_buyed_title_id_fkey" FOREIGN KEY ("buyed_title_id") REFERENCES "buyed_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_buyed_titles_id_fkey" FOREIGN KEY ("buyed_titles_id") REFERENCES "buyed_titles"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
