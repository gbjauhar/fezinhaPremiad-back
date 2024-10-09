-- CreateTable
CREATE TABLE "SubscribedNumber" (
    "id" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscribedNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscribedNumber_id_key" ON "SubscribedNumber"("id");

-- AddForeignKey
ALTER TABLE "SubscribedNumber" ADD CONSTRAINT "SubscribedNumber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
