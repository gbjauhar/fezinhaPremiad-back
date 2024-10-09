-- AlterTable
ALTER TABLE "credit_histories" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "value_histories" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
