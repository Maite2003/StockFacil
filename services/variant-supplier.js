const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');

class VariantSupplierServices {
    static beforeSave(data) {
        const allowedFields = ['purchase_price', 'is_primery_supplier'];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });

        return cleanData;
    }

    static async findAll(userId, supplierId) {
        const products = await prisma.variantSupplier.findMany({where: {user_id: userId, supplier_id: supplierId}});
        return products;
    }

    static async findOne(userId, variantSupplierId) {
        const variantSupplier = await prisma.variantSupplier.findFirst({
            where: {user_id: userId, id: variantSupplierId}
        });
        if (!variantSupplier) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);
        }
        return variantSupplier;
    }

    static async create(userId, supplier_id, variant_id, supplierData) {
        const processed = this.beforeSave(supplierData);
        const variantSupplier = await prisma.variantSupplier.create({
            data: {user_id: userId, supplier_id, variant_id, ...processed}
        });
        return variantSupplier;
    }

    static async update(userId, variantSupplierId, supplierData) {
        let variantSupplier = await prisma.variantSupplier.findFirst({
            where: {id: variantSupplierId, user_id: userId}
        });
        if (!variantSupplier) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);
        }
        const processed = this.beforeSave(supplierData);
        variantSupplier = await prisma.variantSupplier.update({
            where: {id: variantSupplierId},
            data: processed
        });
        return variantSupplier;
    }

    static async delete(userId, variantSupplierId) {
        let variantSupplier = await prisma.variantSupplier.findFirst({
            where: {id: variantSupplierId, user_id: userId}
        });
        if (!variantSupplier) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);        }
        await prisma.variantSupplier.delete({
            where: {id: variantSupplierId}
        });
    }
}

module.exports = VariantSupplierServices;