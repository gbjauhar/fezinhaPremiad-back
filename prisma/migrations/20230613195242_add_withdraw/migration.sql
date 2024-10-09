-- CreateTable
CREATE TABLE "withdraws" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "payment_form" TEXT NOT NULL DEFAULT 'PIX',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdraws_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "withdraws_id_key" ON "withdraws"("id");

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
