const prisma = require('../db/prisma');
const { capitalize } = require('../utils/stringUtils');
const { NotFoundError } = require('../errors');

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
    
    static async findAll(userId) {
        const customers = await prisma.customer.findMany({
            where: {user_id: userId},
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
        return customers;
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

