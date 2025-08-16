const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class SupplierServices {
    static beforeSave(data) {
        const allowedFields = ['first_name', 'last_name', 'company', 'phone',
            'email'
        ];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });

        if (cleanData.email) {
            cleanData.email = cleanData.email.toLowerCase().trim();
        }

        if (cleanData.first_name) {
            cleanData.first_name = capitalize(cleanData.first_name.trim().toLowerCase());
        }

        if (cleanData.last_name) {
            cleanData.last_name = capitalize(cleanData.last_name.trim().toLowerCase());
        }

        if (cleanData.company) {
            cleanData.company = capitalize(cleanData.company.trim());
        }

        return cleanData;
    }

    static generateWhereClause(userId, search) {
        // Build WHERE clause for filtering
        const whereConditions = {
            user_id: userId
        };

        // Add search filter
        if (search && search.trim()) {
            whereConditions.OR = [
                { first_name: { contains: search.trim(), mode: 'insensitive' } },
                { last_name: { contains: search.trim(), mode: 'insensitive' } },
                { email: { contains: search.trim(), mode: 'insensitive' } },
                { company: { contains: search.trim(), mode: 'insensitive' } }
            ];
        }

        return whereConditions;
    }

    static generateSort(userId, sortBy, sortOrder) {
        // Validate sort parameters
        const validSortFields = ['first_name', 'last_name', 'email', 'company', 'created_at', 'updated_at'];
        const validSortOrders = ['asc', 'desc'];
        
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'first_name';
        const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'asc';

        return finalSortBy, finalSortOrder;
    }
    
    static async findAll(userId, reqPagination, reqQuery) {
        const { page, limit, offset } = reqPagination;
        const { search, sortBy = 'first_name', sortOrder = 'asc' } = reqQuery;

        const whereConditions = this.generateWhereClause(userId, search);
        const {finalSortBy, finalSortOrder} = this.generateSort(userId, sortBy, sortOrder);
        const totalItems = await prisma.supplier.count({
            where: whereConditions
        });

        // Get paginated results
        const customers = await prisma.supplier.findMany({
            where: whereConditions,
            orderBy: {
                [finalSortBy]: finalSortOrder
            },
            take: limit,
            skip: offset,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                company: true,
                phone: true,
                email: true,
                created_at: true,
                updated_at: true
            }
        });

        const pagination = calculatePagination(page, limit, totalItems);

        return formatPaginatedResponse(customers, pagination, "suppliers");
    }

    // static async findAll(userId) {
    //     const suppliers = await prisma.supplier.findMany({
    //         where: {user_id: userId},
    //         select: {
    //             id: true,
    //             first_name: true,
    //             last_name: true,
    //             email: true,
    //             phone: true,
    //             company: true,
    //             created_at: true,
    //             updated_at: true,
    //         }
    //     });
    //     return suppliers;
    // }

    static async findById(userId, supplierId) {
        const supplier = await prisma.supplier.findFirst({
            where: {user_id: userId, id: supplierId},
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                company: true,
                created_at: true,
                updated_at: true,
            }
        });
        if (!supplier) {
            throw new NotFoundError(`Supplier with id ${supplierId} not found`);
        }
        return supplier;
    }

    static async create(userId, supplierData) {
        const processed = this.beforeSave(supplierData);
        const supplier = await prisma.supplier.create({
            data: {user_id: userId, ...processed},
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                company: true,
                created_at: true,
                updated_at: true,
            }
        });
        return supplier;
    }

    static async update(userId, supplierId, supplierData) {
        let supplier = await prisma.supplier.findFirst({
            where: {user_id: userId, id: supplierId}
        });
        if (!supplier) {
            throw new NotFoundError(`Supplier with id ${supplierId} does not exist`);
        }
        const processed = this.beforeSave(supplierData);
        supplier = await prisma.supplier.update({
            where: {
                id: supplierId, user_id: userId
            },
            data: processed,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                company: true,
                created_at: true,
                updated_at: true,
            }
        });
        return supplier;
    }

    static async delete(userId, supplierId) {
        let supplier = await prisma.supplier.findFirst({
            where: {user_id: userId, id: supplierId}
        });
        if (!supplier) {
            throw new NotFoundError(`Supplier with id ${supplierId} does not exist`);
        }
        await prisma.supplier.delete({
            where: {id: supplierId, user_id: userId}
        });
    }
}

module.exports = SupplierServices;