-- DropForeignKey
ALTER TABLE "titles" DROP CONSTRAINT "titles_user_id_fkey";

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
