/*
  Warnings:

  - You are about to drop the column `enable_stock_alerts` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `min_stock_alert` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "enable_stock_alerts",
DROP COLUMN "min_stock_alert";
