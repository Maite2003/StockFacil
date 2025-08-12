/*
  Warnings:

  - You are about to drop the column `sku` on the `product_variants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."product_variants_sku_key";

-- AlterTable
ALTER TABLE "public"."product_variants" DROP COLUMN "sku";
