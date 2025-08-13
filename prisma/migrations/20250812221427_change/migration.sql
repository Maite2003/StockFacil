/*
  Warnings:

  - Made the column `min_stock_alert` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."product_variants" ALTER COLUMN "min_stock_alert" SET NOT NULL,
ALTER COLUMN "min_stock_alert" SET DEFAULT 0,
ALTER COLUMN "is_default" SET DEFAULT false;
