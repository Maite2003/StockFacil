const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class SupplierServices {
    static beforeSave(supplierData) {
        if (supplierData.email) {
            supplierData.email = supplierData.email.toLowerCase().trim();
        }

        if (supplierData.first_name) {
            supplierData.first_name = capitalize(supplierData.first_name.trim().toLowerCase());
        }

        if (supplierData.last_name) {
            supplierData.last_name = capitalize(supplierData.last_name.trim().toLowerCase());
        }

        if (supplierData.company) {
            supplierData.company = capitalize(supplierData.company.trim());
        }

        return supplierData;
    }

    static async findAll(userId) {
        const suppliers = await prisma.supplier.findMany({
            where: {user_id: userId}
        });
        return suppliers;
    }

    static async findById(userId, supplierId) {
        const supplier = await prisma.supplier.findUnique({
            where: {user_id: userId, id: supplierId}
        });
        if (!supplier) {
            throw new NotFoundError(`Supplier with id ${supplierId} not found`);
        }
        return supplier;
    }

    static async create(userId, supplierData) {
        const processed = this.beforeSave(supplierData);
        const supplier = await prisma.supplier.create({
            data: {user_id: userId, ...processed}
        });
        return supplier;
    }

    static async update(userId, supplierId, supplierData) {
        const processed = this.beforeSave(supplierData);
        try {
            const supplier = await prisma.supplier.update({
                where: {
                    id: supplierId, user_id: userId
                },
                data: processed
            });
            return supplier;
        } catch (error) {
            throw new NotFoundError(`Supplier with id ${supplierId} does not exist`);
        }
    }

    static async delete(userId, supplierId) {
        try {
            await prisma.supplier.delete({
                where: {id: supplierId, user_id: userId}
            });
        } catch(error) {
            throw new NotFoundError(`Supplier with id ${supplierId} does not exist`);
        }
    }
}

module.exports = SupplierServices;