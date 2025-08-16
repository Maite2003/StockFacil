const prisma = require('../db/prisma');
const { capitalize } = require('../utils/stringUtils');
const { NotFoundError } = require('../errors');
const { calculatePagination, formatPaginatedResponse } = require('../utils/pagination');

class CustomerServices {
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

    static generateSort(sortBy, sortOrder) {
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
        const {finalSortBy, finalSortOrder} = this.generateSort(sortBy, sortOrder);
        const totalItems = await prisma.customer.count({
            where: whereConditions
        });

        // Get paginated results
        const customers = await prisma.customer.findMany({
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

        return formatPaginatedResponse(customers, pagination, "customers");
    }

    static async findById(userId, id) {
        const customer = await prisma.customer.findFirst({
            where: {user_id: userId, id},
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
        if (!customer) {
            throw new (`Customer with id ${id} does not exists`);
        }
        return customer;
    }

    static async create(userId, customerData) {
        const processed = this.beforeSave(customerData);
        const customer = await prisma.customer.create({
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
        return customer;
    }

    static async update(userId, customerId, customerData) {
        let customer = await prisma.customer.findFirst({
            where: {id: customerId, user_id: userId}
        });
        if (!customer) {
            throw new NotFoundError(`Customer with id ${customerId} does not exist`);
        }
        const processed = this.beforeSave(customerData);
        customer = await prisma.customer.update({
            where: {user_id: userId, id: customerId},
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
        return customer;
    }

    static async delete(userId, customerId) {
        let customer = await prisma.customer.findFirst({
            where: {id: customerId, user_id: userId}
        });
        if (!customer) {
            throw new NotFoundError(`Customer with id ${customerId} does not exist`);
        }
        await prisma.customer.delete({
            where: {id: customerId}
        });
    }
}

module.exports = CustomerServices;

