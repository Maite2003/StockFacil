/*
  Warnings:

  - You are about to drop the column `supplier_sku` on the `variant_suppliers` table. All the data in the column will be lost.
  - You are about to drop the `product_suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."product_suppliers" DROP CONSTRAINT "product_suppliers_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_suppliers" DROP CONSTRAINT "product_suppliers_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_suppliers" DROP CONSTRAINT "product_suppliers_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."variant_suppliers" DROP COLUMN "supplier_sku";

-- DropTable
DROP TABLE "public"."product_suppliers";
