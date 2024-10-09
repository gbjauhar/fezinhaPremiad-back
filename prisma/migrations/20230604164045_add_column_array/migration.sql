/*
  Warnings:

  - The `dozens` column on the `titles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "titles" DROP COLUMN "dozens",
ADD COLUMN     "dozens" TEXT[];
