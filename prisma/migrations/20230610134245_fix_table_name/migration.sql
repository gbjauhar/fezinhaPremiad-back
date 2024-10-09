/*
  Warnings:

  - You are about to drop the `CreditHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CreditHistory";

-- CreateTable
CREATE TABLE "credit_histories" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "deposit_type" "DepositType" NOT NULL DEFAULT 'PIX',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_histories_id_key" ON "credit_histories"("id");
