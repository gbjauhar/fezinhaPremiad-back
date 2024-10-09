-- CreateEnum
CREATE TYPE "DepositType" AS ENUM ('PIX');

-- CreateTable
CREATE TABLE "CreditHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "deposit_type" "DepositType" NOT NULL DEFAULT 'PIX',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditHistory_id_key" ON "CreditHistory"("id");
