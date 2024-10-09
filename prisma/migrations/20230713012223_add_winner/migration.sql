-- AlterTable
ALTER TABLE "editions" ADD COLUMN     "winner_id" TEXT;

-- AddForeignKey
ALTER TABLE "editions" ADD CONSTRAINT "editions_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
