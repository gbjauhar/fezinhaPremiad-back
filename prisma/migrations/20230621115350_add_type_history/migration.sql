-- CreateEnum
CREATE TYPE "HistoryType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'OTHER');

-- AlterTable
ALTER TABLE "credit_histories" ADD COLUMN     "type" "HistoryType" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "value_histories" ADD COLUMN     "type" "HistoryType" NOT NULL DEFAULT 'OTHER';
