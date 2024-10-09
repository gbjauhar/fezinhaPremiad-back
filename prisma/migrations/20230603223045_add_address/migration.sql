/*
  Warnings:

  - You are about to drop the column `afiliates_to` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "afiliates_to",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "associated_to" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "uf" TEXT;
