-- AlterTable
ALTER TABLE "scratch_cards" ADD COLUMN     "result" TEXT[] DEFAULT ARRAY[]::TEXT[];
