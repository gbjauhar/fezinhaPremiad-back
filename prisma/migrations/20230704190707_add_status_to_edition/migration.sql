-- CreateEnum
CREATE TYPE "EditionStatus" AS ENUM ('OPEN', 'CLOSED', 'FINISHED');

-- AlterTable
ALTER TABLE "editions" ADD COLUMN     "status" "EditionStatus" NOT NULL DEFAULT 'OPEN';
