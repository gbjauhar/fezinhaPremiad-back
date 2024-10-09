/*
  Warnings:

  - The values [COMISSION] on the enum `HistoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HistoryType_new" AS ENUM ('DEPOSIT', 'WITHDRAW', 'COMMISSION', 'OTHER');
ALTER TABLE "credit_histories" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "value_histories" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "credit_histories" ALTER COLUMN "type" TYPE "HistoryType_new" USING ("type"::text::"HistoryType_new");
ALTER TABLE "value_histories" ALTER COLUMN "type" TYPE "HistoryType_new" USING ("type"::text::"HistoryType_new");
ALTER TYPE "HistoryType" RENAME TO "HistoryType_old";
ALTER TYPE "HistoryType_new" RENAME TO "HistoryType";
DROP TYPE "HistoryType_old";
ALTER TABLE "credit_histories" ALTER COLUMN "type" SET DEFAULT 'OTHER';
ALTER TABLE "value_histories" ALTER COLUMN "type" SET DEFAULT 'OTHER';
COMMIT;
