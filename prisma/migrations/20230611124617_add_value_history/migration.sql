-- AlterTable
ALTER TABLE "users" ADD COLUMN     "credit_limit" DOUBLE PRECISION NOT NULL DEFAULT 300;

-- CreateTable
CREATE TABLE "value_histories" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "deposit_type" "DepositType" NOT NULL DEFAULT 'PIX',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "value_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "value_histories_id_key" ON "value_histories"("id");

-- AddForeignKey
ALTER TABLE "value_histories" ADD CONSTRAINT "value_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
