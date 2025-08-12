const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const {capitalize} = require('../utils/stringUtils');
const ProductVariantServices = require('./product-variant');

class productServices {
    static beforeSave(productData) {
        if (productData.name) {
            productData.name = capitalize(productData.name.trim());
        }
        if (productData.description) {
            productData.description = capitalize(productData.description.trim());
        }
        return productData;
    }

    static async findAll(userId) {
        const products = await prisma.product.findMany({
            where: {user_id: userId}
        });
        return products;
    }

    static async findById(userId, id) {
        const product = await prisma.product.findUnique({
            where: {user_id: userId, id}
        });
        if (!product) {
            throw new NotFoundError(`Product with id ${id} not found`);
        }
        return product;
    }

    static async createProduct(userId, data) {
        const {stock, min_stock_alert, enable_stock_alerts, ...productData} = data;
        const processed = this.beforeSave(productData);
        const product = await prisma.product.create({
            data: {user_id: userId, ...processed}
        });

        console.log("min_stock_alert es ", min_stock_alert);
        if (!processed.has_variants) {
            const productVariant = {
                variant_name: "Default",
                selling_price_modifier: 0,
                stock: stock || 0,
                min_stock_alert,
                enable_stock_alerts
            };
            // create default variant
            await ProductVariantServices.create(userId, product.id, productVariant);
        }

        return product;
    }

    static async updateProduct(userId, productId, productData) {
        try {
            const processed = this.beforeSave(productData);
            const product = await prisma.product.update({
                where: {id: productId, user_id: userId},
                data: processed
            });
            return product;
        } catch(error) {
            throw new NotFoundError(`Product with id ${productId} does not exists`);
        }
    }

    static async deleteProduct(userId, productId) {
        try {
            await prisma.product.delete({
                where: {id: productId, user_id: userId}
            });
        } catch(error) {
            throw new NotFoundError(`Product with id ${productId} does not exists`);
        }
    }
}

module.exports = productServices;