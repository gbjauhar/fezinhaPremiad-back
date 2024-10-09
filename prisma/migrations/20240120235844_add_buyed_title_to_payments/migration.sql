-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "buyedTitlesId" TEXT,
ADD COLUMN     "buyed_title_id" TEXT;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_buyedTitlesId_fkey" FOREIGN KEY ("buyedTitlesId") REFERENCES "buyed_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
