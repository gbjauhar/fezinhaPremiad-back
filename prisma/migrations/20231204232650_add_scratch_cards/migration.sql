-- CreateTable
CREATE TABLE "scratch_cards" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scratch_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scratch_cards_id_key" ON "scratch_cards"("id");

-- AddForeignKey
ALTER TABLE "scratch_cards" ADD CONSTRAINT "scratch_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
