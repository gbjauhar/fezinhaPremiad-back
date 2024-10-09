-- CreateEnum
CREATE TYPE "OptionsToPay" AS ENUM ('TITLES', 'CREDIT', 'VALUE');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "option" "OptionsToPay" NOT NULL DEFAULT 'TITLES',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
