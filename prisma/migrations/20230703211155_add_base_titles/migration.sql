-- CreateTable
CREATE TABLE "base_title" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dozens" TEXT[],
    "bar_code" TEXT,
    "qr_code" TEXT,
    "chances" INTEGER NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "base_title_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_title_id_key" ON "base_title"("id");
