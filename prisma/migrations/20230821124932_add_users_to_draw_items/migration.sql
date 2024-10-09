-- AlterTable
ALTER TABLE "draw_items" ADD COLUMN     "selected_dozens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "draw_items" ADD CONSTRAINT "draw_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
