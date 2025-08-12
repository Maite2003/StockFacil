
const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class ProductVariantServices {
    static beforeSave(variantData) {
        if (variantData.name) {
            variantData.name = capitalize(variantData.name.trim());
        }
        return variantData;
    }

    static async findAll(userId, productId) {
        const variants = await prisma.productVariant.findMany({
            where: {user_id: userId, product_id:productId}
        });
        return variants;
    }

    static async findById(userId, productId, variantId) {
        const variant = await prisma.productVariant.findUnique({
            where: {user_id: userId, product_id: productId, id: variantId}
        });
        if (!variant) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
    }

    static async create(userId, productId, productVariantData) {
        const processed = this.beforeSave(productVariantData);
        const variant = await prisma.productVariant.create({
            data: {user_id:userId, product_id: productId, ...processed}
        });
        return variant;
    }

    static async update(userId, productId, variantId, productVariantData) {
        const processed = this.beforeSave(productVariantData);
        try {
            const variant = await prisma.productVariant.update({
                where: {user_id: userId, product_id: productId, id: variantId},
                data: productVariantData
            });
        } catch (error) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
    }

    static async delete(userId, productId, variantId) {
        try {
            await prisma.productVariant.delete({
                where: {user_id: userId, product_id: productId, id: variantId}
            });
        } catch(error) {
            throw new NotFoundError(`Variant with id ${variantId} (of product ${productId}) not found`);
        }
    }
}

module.exports = ProductVariantServices;