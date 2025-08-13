const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const {capitalize} = require('../utils/stringUtils');
const ProductVariantServices = require('./product-variant');

class productServices {
    static beforeSave(data) {
        const allowedFields = ['name', 'description', 'selling_price',
            'category_id'
        ];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });

        if (cleanData.name) {
            cleanData.name = capitalize(cleanData.name.trim());
        }
        if (cleanData.description) {
            cleanData.description = capitalize(cleanData.description.trim());
        }
        return cleanData;
    }

    static generateVariantsInfo(product) {
        const customVariants = product.variants.filter(v => !v.is_default);
        const defaultVariant = product.variants.find(v => v.is_default);
        
        const total_stock = customVariants.length > 0 
            ? customVariants.reduce((sum, v) => sum + v.stock, 0)
            : (defaultVariant?.stock || 0);

        return {
            ...product,
            total_stock
        }
    }

    static async findAll(userId) {
        const products = await prisma.$queryRaw`
            SELECT 
                p.id::integer,
                p.name,
                p.selling_price::numeric,
                p.description,
                p.created_at as "created_at",
                p.updated_at as "updated_at",
                -- Category as nested object
                json_build_object(
                    'id', c.id::integer,
                    'name', c.name
                ) as category,
                -- All variants (custom + default) as JSON array
                (SELECT COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pv.id::integer,
                            'variant_name', pv.variant_name,
                            'stock', pv.stock::integer,
                            'selling_price_modifier', pv.selling_price_modifier::numeric,
                            'min_stock_alert', pv.min_stock_alert::integer,
                            'enable_stock_alerts', pv.enable_stock_alerts,
                            'is_default', pv.is_default,
                            'attributes', pv.attributes
                        ) ORDER BY pv.is_default DESC, pv.variant_name
                    ), 
                    '[]'::json
                ) FROM product_variants pv 
                WHERE pv.product_id = p.id) as variants,

                -- Total stock calculation
                CASE 
                    -- If has custom variants, sum only custom variants
                    WHEN EXISTS (SELECT 1 FROM product_variants pv3 
                            WHERE pv3.product_id = p.id AND pv3.is_default = false) THEN
                        (SELECT COALESCE(SUM(stock), 0)::integer FROM product_variants pv4 
                        WHERE pv4.product_id = p.id AND pv4.is_default = false)
                    -- If only default variant, use its stock
                    ELSE 
                        (SELECT COALESCE(stock, 0)::integer FROM product_variants pv5 
                        WHERE pv5.product_id = p.id AND pv5.is_default = true)
                END as total_stock
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.user_id = ${userId}
            ORDER BY p.created_at DESC;
        `;
        
        return products.map(product => {
            const withVariants = this.generateVariantsInfo(product);
            return {
                ...withVariants,
                selling_price: parseFloat(product.selling_price),
            }
        });
    }

    static async findById(userId, id) {
        const product = await prisma.product.findFirst({
            where: {user_id: userId, id},
            select: {
                id: true,
                name: true,
                selling_price: true,
                description: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                created_at: true,
                updated_at: true,
                variants: {
                    select: {
                        id: true,
                        stock: true,
                        is_default: true,
                        selling_price_modifier: true,
                        min_stock_alert: true,
                        enable_stock_alerts: true,
                        attributes: true
                    }
                }
            }
        });
        if (!product) {
            throw new NotFoundError(`Product with id ${id} not found`);
        }

        return {
            ...this.generateVariantsInfo(product),
            selling_price: parseFloat(product.selling_price)
        };
    }

    static async createProduct(userId, data) {
        const {stock, min_stock_alert, enable_stock_alerts, ...productData} = data;
        const processed = this.beforeSave(productData);
        const product = await prisma.product.create({
            data: {user_id: userId, ...processed},
            select: {
                id: true,
                name: true,
                selling_price: true,
                description: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                created_at: true,
                updated_at: true
            }
        });

        // always create default variant
        const productVariant = {
            variant_name: "Default",
            selling_price_modifier: 0,
            is_default: true,
            stock,
            min_stock_alert,
            enable_stock_alerts
        };
        const variant = await ProductVariantServices.create(userId, product.id, productVariant);

        product.total_stock = variant.stock;
        product.min_stock_alert = variant.min_stock_alert;
        product.enable_stock_alerts = variant.enable_stock_alerts;

        product.selling_price = parseFloat(product.selling_price);
        return product;
    }

    static async updateProduct(userId, productId, data) {
        const {stock, min_stock_alert, enable_stock_alerts, ...productData} = data;
        let product = await prisma.product.findFirst({
            where: {user_id: userId, id: productId}
        });
        if (!product) {
            throw new NotFoundError(`Product with id ${productId} does not exists`);
        }
        // update product fields
        const processed = this.beforeSave(productData);
        product = await prisma.product.update({
            where: {id: productId},
            select: {
                id: true,
                name: true,
                selling_price: true,
                description: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                created_at: true,
                updated_at: true,
                variants: {
                    select: {
                        id: true,
                        stock: true,
                        is_default: true
                    }
                }
            },
            data: processed
        });
        if (product.variants.length === 0) {
            // No variants, has to update default variant
            let variantChanges = {};
            if (stock !== undefined) {variantChanges.stock = stock};
            if (min_stock_alert !== undefined) {variantChanges.min_stock_alert = min_stock_alert};
            if (enable_stock_alerts !== undefined) {variantChanges.enable_stock_alerts = enable_stock_alerts};
            if (Object.keys(variantChanges).length > 0) { // There are variant changes
                // update default variant
                const variant = await ProductVariantServices.updateProductDefaultVariant(userId, productId, variantChanges);
                if (variant.stock) {product.stock = stock};
                if (variant.enable_stock_alerts) {product.enable_stock_alerts = enable_stock_alerts}
                if (variant.min_stock_alert) {product.min_stock_alert};
            }
        }
        product.selling_price = parseFloat(product.selling_price)
        return product;
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