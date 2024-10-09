/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "code" TEXT,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");
