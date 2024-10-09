-- CreateTable
CREATE TABLE "buyed_titles" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyed_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selled_titles" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "title_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selled_titles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buyed_titles_id_key" ON "buyed_titles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "selled_titles_id_key" ON "selled_titles"("id");

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyed_titles" ADD CONSTRAINT "buyed_titles_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selled_titles" ADD CONSTRAINT "selled_titles_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
