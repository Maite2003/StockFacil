const prisma = require('../db/prisma');
const { capitalize } = require('../utils/stringUtils');
const { NotFoundError } = require('../errors');

class CustomerServices {
    static beforeSave(customerData) {
        if (customerData.email) {
            customerData.email = customerData.email.toLowerCase().trim();
        }

        if (customerData.first_name) {
            customerData.first_name = capitalize(customerData.first_name.trim().toLowerCase());
        }

        if (customerData.last_name) {
            customerData.last_name = capitalize(customerData.last_name.trim().toLowerCase());
        }

        if (customerData.company) {
            customerData.company = capitalize(customerData.company.trim());
        }

        return customerData;
    }
    
    static async findAll(userId) {
        const customers = await prisma.customer.findMany({
            where: {user_id: userId}
        });
        return customers;
    }

    static async findById(userId, id) {
        const customer = await prisma.customer.findUnique({
            where: {user_id: userId, id}
        });
        if (!customer) {
            throw new (`Customer with id ${id} does not exists`);
        }
        return customer;
    }

    static async create(userId, customerData) {
        const processed = this.beforeSave(customerData);
        const customer = await prisma.customer.create({
            data: {user_id: userId, ...processed}
        });
        return customer;
    }

    static async update(userId, customerId, customerData) {
        const processed = this.beforeSave(customerData);
        try {
            const updatedCustomer = await prisma.customer.update({
                where: {user_id: userId, id: customerId},
                data: processed
            });
            return updatedCustomer;
        } catch (error) {
            throw new NotFoundError(`Customer with id ${customerId} does not exist`);
        }
    }

    static async delete(userId, customerId) {
        try {
            await prisma.customer.delete({
                where: {user_id: userId, id: customerId}
            })
        } catch(error) {
            throw new NotFoundError(`Customer with id ${customerId} does not exist`)
        }
    }
}

module.exports = CustomerServices;

