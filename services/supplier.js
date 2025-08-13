const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class SupplierServices {
    static beforeSave(supplierData) {
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
        const suppliers = await prisma.supplier.findMany({
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
        return suppliers;
    }

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