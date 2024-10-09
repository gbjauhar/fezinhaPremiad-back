-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "payment_id" TEXT;

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
