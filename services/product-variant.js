
const prisma = require('../db/prisma');
const { NotFoundError, BadRequestError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class ProductVariantServices {
    static beforeSave(data) {
        const allowedFields = ['variant_name', 'selling_price_modifier',
            'stock', 'attributes', 'min_stock_alert', 'enable_stock_alerts', 'is_default'
        ];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });

        if (cleanData.variant_name) {
            cleanData.variant_name = capitalize(cleanData.variant_name.trim());
        }
        return cleanData;
    }

    static async findAll(userId, productId) {
        const variants = await prisma.productVariant.findMany({
            where: {user_id: userId, product_id:productId},
            select: {
                id: true,
                variant_name: true,
                stock: true,
                selling_price_modifier: true,
                min_stock_alert: true,
                enable_stock_alerts: true,
                is_default: true,
                attributes: true,
                created_at: true,
                updated_at: true
            }
        });
        return variants;
    }

    static async findById(userId, productId, variantId) {
        const variant = await prisma.productVariant.findFirst({
            where: {user_id: userId, product_id: productId, id: variantId},
            select: {
                id: true,
                variant_name: true,
                stock: true,
                selling_price_modifier: true,
                min_stock_alert: true,
                enable_stock_alerts: true,
                is_default: true,
                attributes: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!variant) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
        return variant;
    }

    static async create(userId, productId, productVariantData) {
        const processed = this.beforeSave(productVariantData);
        const variant = await prisma.productVariant.create({
            data: {user_id:userId, product_id: productId, ...processed},
            select: {
                id: true,
                variant_name: true,
                stock: true,
                selling_price_modifier: true,
                min_stock_alert: true,
                enable_stock_alerts: true,
                is_default: true,
                attributes: true,
                created_at: true,
                updated_at: true
            }
        });
        delete variant.user_id;
        return variant;
    }

    static async update(userId, productId, variantId, productVariantData) {
        let variant = await prisma.productVariant.findFirst({
            where: {id: variantId, user_id: userId, product_id: productId}
        });
        if (!variant) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
        const processed = this.beforeSave(productVariantData);
        variant = await prisma.productVariant.update({
            where: {id: variantId},
            data: processed,
            select: {
                id: true,
                variant_name: true,
                stock: true,
                selling_price_modifier: true,
                min_stock_alert: true,
                enable_stock_alerts: true,
                is_default: true,
                attributes: true,
                created_at: true,
                updated_at: true
            }
        });
        return variant;
    }

    static async updateProductDefaultVariant(userId, productId, productVariantData) {
        let variant = await prisma.productVariant.findFirst({
            where: {user_id: userId, product_id: productId}
        });
        if (!variant) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
        const processed = this.beforeSave(productVariantData);
        variant = await prisma.productVariant.update({
            where: {id: variant.id},
            data: processed,
            select: {
                id: true,
                stock: true,
                min_stock_alert: true,
                enable_stock_alerts: true,
            }
        });
        return variant;
    }

    static async delete(userId, productId, variantId) {
        let variant = await prisma.productVariant.findFirst({
            where: {id: variantId, user_id: userId, product_id: productId}
        });
        if (!variant) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
        if (variant.is_default) {
            throw new BadRequestError(`Cannot delete default variant`);
        }
        await prisma.productVariant.delete({
            where: {id: variantId}
        });
    }
}

module.exports = ProductVariantServices;