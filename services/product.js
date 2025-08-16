const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { formatPaginatedResponse, calculatePagination } = require('../utils/pagination');
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

    static buildWhereClause(user_id, search, category) {
        
        // Build WHERE clause for filtering
        let whereClause = `WHERE p.user_id = $1`;
        let queryParams = [user_id];
        let paramCount = 1;

        if (search && search.trim()) {
            paramCount++;
            whereClause += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
            queryParams.push(`%${search.trim()}%`);
        }

        // Add category filter
        if (category && !isNaN(parseInt(category))) {
        paramCount++;
        whereClause += ` AND p.category_id = $${paramCount}`;
        queryParams.push(parseInt(category));
        }

        return {whereClause, queryParams, paramCount};
    }

    static buildOrderByClause(sortBy, sortOrder) {
        // Build ORDER BY clause
        const validSortFields = ['name', 'selling_price', 'created_at', 'updated_at'];
        const validSortOrders = ['asc', 'desc'];
        
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
        const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'ASC';
        
        const orderClause = `ORDER BY p.${finalSortBy} ${finalSortOrder}`;

        return orderClause;
    }

    static async getTotalItems(whereClause, queryParams) {
        // Count total items for pagination
        const countQuery = `
        SELECT COUNT(*)::int as total
        FROM products p
        ${whereClause}
        `;
        
        const countResult = await prisma.$queryRawUnsafe(countQuery, ...queryParams);
        const totalItems = countResult[0].total;

        return totalItems;
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

    static async findAll(userId, reqPagination, reqQuery) {
        const { page, limit, offset } = reqPagination;
        const { search, category, sortBy = 'name', sortOrder = 'asc' } = reqQuery;

        const {whereClause, queryParams, paramCount} = this.buildWhereClause(userId, search, category);
        const orderByClause = this.buildOrderByClause(sortBy, sortOrder);
        const totalItems = await this.getTotalItems(whereClause, queryParams);

        queryParams.push(limit, offset);

        // Get paginated results
        const dataQuery = `
        SELECT 
            p.id,
            p.name,
            p.description,
            p.selling_price::numeric::float8 as selling_price,
            p.created_at,
            p.updated_at,
            json_build_object('id', c.id, 'name', c.name) as category,
            COALESCE(
            json_agg(
                json_build_object(
                'id', pv.id,
                'variant_name', pv.variant_name,
                'stock', pv.stock,
                'selling_price_modifier', pv.selling_price_modifier::numeric::float8,
                'min_stock_alert', pv.min_stock_alert,
                'enable_stock_alerts', pv.enable_stock_alerts,
                'is_default', pv.is_default,
                'attributes', pv.attributes
                ) ORDER BY pv.is_default DESC, pv.id
            ), '[]'::json
            ) as variants,
            
            CASE 
                WHEN EXISTS (SELECT 1 FROM product_variants pv3 
                        WHERE pv3.product_id = p.id AND pv3.is_default = false) THEN
                    (SELECT COALESCE(SUM(stock), 0)::integer FROM product_variants pv4 
                    WHERE pv4.product_id = p.id AND pv4.is_default = false)
                ELSE 
                    (SELECT COALESCE(stock, 0)::integer FROM product_variants pv5 
                    WHERE pv5.product_id = p.id AND pv5.is_default = true)
            END as total_stock

        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id AND c.user_id = p.user_id
        LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.user_id = p.user_id
        ${whereClause}
        GROUP BY p.id, p.name, p.description, p.selling_price, p.created_at, p.updated_at, c.id, c.name
        ${orderByClause}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
        `;

        const products = await prisma.$queryRawUnsafe(dataQuery, ...queryParams);

        // Calculate pagination metadata
        const pagination = calculatePagination(page, limit, totalItems);

        console.log(pagination);

        return formatPaginatedResponse(products, pagination, 'products');

        // const products = await prisma.$queryRaw`
        //     SELECT 
        //         p.id::integer,
        //         p.name,
        //         p.selling_price::numeric,
        //         p.description,
        //         p.created_at as "created_at",
        //         p.updated_at as "updated_at",
        //         -- Category as nested object
        //         json_build_object(
        //             'id', c.id::integer,
        //             'name', c.name
        //         ) as category,
        //         -- All variants (custom + default) as JSON array
        //         (SELECT COALESCE(
        //             json_agg(
        //                 json_build_object(
        //                     'id', pv.id::integer,
        //                     'variant_name', pv.variant_name,
        //                     'stock', pv.stock::integer,
        //                     'selling_price_modifier', pv.selling_price_modifier::numeric,
        //                     'min_stock_alert', pv.min_stock_alert::integer,
        //                     'enable_stock_alerts', pv.enable_stock_alerts,
        //                     'is_default', pv.is_default,
        //                     'attributes', pv.attributes
        //                 ) ORDER BY pv.is_default DESC, pv.variant_name
        //             ), 
        //             '[]'::json
        //         ) WHERE pv.product_id = p.id) as variants,

        //         -- Total stock calculation
        //         CASE 
        //             -- If has custom variants, sum only custom variants
        //             WHEN EXISTS (SELECT 1 FROM product_variants pv3 
        //                     WHERE pv3.product_id = p.id AND pv3.is_default = false) THEN
        //                 (SELECT COALESCE(SUM(stock), 0)::integer FROM product_variants pv4 
        //                 WHERE pv4.product_id = p.id AND pv4.is_default = false)
        //             -- If only default variant, use its stock
        //             ELSE 
        //                 (SELECT COALESCE(stock, 0)::integer FROM product_variants pv5 
        //                 WHERE pv5.product_id = p.id AND pv5.is_default = true)
        //         END as total_stock
        //     FROM products p
        //     LEFT JOIN categories c ON p.category_id = c.id
        //     WHERE p.user_id = ${userId} AND p.category_id = category AND 
        //     ORDER BY p.created_at DESC;
        // `;
        
    
        // return products.map(product => {
        //     const withVariants = this.generateVariantsInfo(product);
        //     return {
        //         ...withVariants,
        //         selling_price: parseFloat(product.selling_price),
        //     }
        // });
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
            throw new NotFoundError(`Product with id ${productId} not found`);
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
            throw new NotFoundError(`Product with id ${productId} not found`);
        }
    }
}

module.exports = productServices;