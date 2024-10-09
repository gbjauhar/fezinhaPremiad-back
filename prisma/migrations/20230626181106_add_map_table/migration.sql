/*
  Warnings:

  - You are about to drop the `SubscribedNumber` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubscribedNumber" DROP CONSTRAINT "SubscribedNumber_user_id_fkey";

-- DropTable
DROP TABLE "SubscribedNumber";

-- CreateTable
CREATE TABLE "subscribed_numbers" (
    "id" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribed_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribed_numbers_id_key" ON "subscribed_numbers"("id");

-- AddForeignKey
ALTER TABLE "subscribed_numbers" ADD CONSTRAINT "subscribed_numbers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
