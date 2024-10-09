-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "edition_id" TEXT;

-- CreateTable
CREATE TABLE "editions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_draw" TIMESTAMP(3) NOT NULL,
    "order" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fisical_titles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dozens" TEXT[],
    "bar_code" TEXT,
    "qr_code" TEXT,
    "chances" INTEGER NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyed_title_id" TEXT,
    "editionId" TEXT,

    CONSTRAINT "fisical_titles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "editions_id_key" ON "editions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fisical_titles_id_key" ON "fisical_titles"("id");

-- AddForeignKey
ALTER TABLE "titles" ADD CONSTRAINT "titles_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisical_titles" ADD CONSTRAINT "fisical_titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisical_titles" ADD CONSTRAINT "fisical_titles_buyed_title_id_fkey" FOREIGN KEY ("buyed_title_id") REFERENCES "buyed_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisical_titles" ADD CONSTRAINT "fisical_titles_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
