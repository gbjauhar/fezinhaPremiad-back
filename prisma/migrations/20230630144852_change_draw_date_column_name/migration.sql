/*
  Warnings:

  - You are about to drop the column `date_draw` on the `editions` table. All the data in the column will be lost.
  - Added the required column `draw_date` to the `editions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "editions" DROP COLUMN "date_draw",
ADD COLUMN     "draw_date" TIMESTAMP(3) NOT NULL;
