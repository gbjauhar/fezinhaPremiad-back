/*
  Warnings:

  - Added the required column `user_id` to the `credit_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_histories" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "credit_histories" ADD CONSTRAINT "credit_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
