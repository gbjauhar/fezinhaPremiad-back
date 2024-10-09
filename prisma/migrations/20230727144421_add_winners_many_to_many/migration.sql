/*
  Warnings:

  - You are about to drop the column `winner_id` on the `editions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "editions" DROP CONSTRAINT "editions_winner_id_fkey";

-- AlterTable
ALTER TABLE "editions" DROP COLUMN "winner_id";

-- CreateTable
CREATE TABLE "_EditionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EditionToUser_AB_unique" ON "_EditionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionToUser_B_index" ON "_EditionToUser"("B");

-- AddForeignKey
ALTER TABLE "_EditionToUser" ADD CONSTRAINT "_EditionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionToUser" ADD CONSTRAINT "_EditionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
