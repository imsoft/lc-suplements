-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "neighborhood" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OrderAddress" ADD COLUMN     "neighborhood" TEXT NOT NULL DEFAULT '';
