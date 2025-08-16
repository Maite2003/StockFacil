
const prisma = require('../db/prisma');
const { NotFoundError, BadRequestError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');
const { formatPaginatedResponse, calculatePagination } = require('../utils/pagination');

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

    static generateWhereClause(userId, productId, search) {
        // Build WHERE clause for filtering
        const whereConditions = {
        user_id: userId,
        product_id: productId
        };

        // Add search filter
        if (search && search.trim()) {
            whereConditions.variant_name = {
                contains: search.trim(),
                mode: 'insensitive'
            };
        }
        return whereConditions;
    }

    static generateOrderBy(sortBy, sortOrder) {
        // Validate sort parameters
        const validSortFields = ['variant_name', 'stock', 'selling_price_modifier', 'min_stock_alert', 'is_default', 'created_at', 'updated_at'];
        const validSortOrders = ['asc', 'desc'];
        
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'variant_name';
        const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'asc';

        // Special ordering: default variants first, then by chosen field
        const orderByClause = finalSortBy === 'is_default' ? 
        [{ is_default: 'desc' }, { variant_name: 'asc' }] :
        [{ is_default: 'desc' }, { [finalSortBy]: finalSortOrder }];

        return orderByClause;

    }

    static async findAll(userId, productId, reqPagination, reqQuery) {

        const { page, limit, offset } = reqPagination;
        const { search, sortBy = 'variant_name', sortOrder = 'asc' } = reqQuery;
        const whereClause = this.generateWhereClause(userId, productId, search);
        const orderByClause = this.generateOrderBy(sortBy, sortOrder);
        const totalItems = await prisma.productVariant.count({
        where: whereClause
        });

        const variants = await prisma.productVariant.findMany({
            where: whereClause,
            orderBy: orderByClause,
            take: limit,
            skip: offset,
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

        // Calculate pagination metadata
        const pagination = calculatePagination(page, limit, totalItems);

        return formatPaginatedResponse(variants, pagination, 'variants');
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

        const product = await prisma.product.findFirst({
            where: {user_id: userId, id: productId}
        });

        if (!product) {
            throw new NotFoundError(`Product with id ${productId} not found`);
        }

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