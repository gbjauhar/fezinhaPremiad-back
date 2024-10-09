/*
  Warnings:

  - You are about to drop the `NotificationSubscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Titles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationSubscriptions" DROP CONSTRAINT "NotificationSubscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Titles" DROP CONSTRAINT "Titles_user_id_fkey";

-- DropTable
DROP TABLE "NotificationSubscriptions";

-- DropTable
DROP TABLE "Titles";

-- CreateTable
CREATE TABLE "titles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dozens" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications_on_users" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "expirationTime" TEXT,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_on_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "titles_id_key" ON "titles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_on_users_id_key" ON "notifications_on_users"("id");

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_on_users" ADD CONSTRAINT "notifications_on_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
