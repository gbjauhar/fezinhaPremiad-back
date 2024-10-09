/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `editions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `titles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "editions_name_key" ON "editions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "titles_name_key" ON "titles"("name");
