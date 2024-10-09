-- CreateEnum
CREATE TYPE "SortFileType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateTable
CREATE TABLE "sort_assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "type" "SortFileType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sort_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sort_assets_id_key" ON "sort_assets"("id");
