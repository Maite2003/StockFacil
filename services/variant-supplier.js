const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');

class VariantSupplierServices {
    static async findAll(userId, supplierId) {
        const products = await prisma.variantSupplier.findMany({where: {user_id: userId, supplier_id: supplierId}});
        return products;
    }

    static async findOne(userId, variantSupplierId) {
        const variantSupplier = await prisma.variantSupplier.findOne({
            where: {user_id: userId, id: variantSupplierId}
        });
        if (!variantSupplier) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);
        }
        return variantSupplier;
    }

    static async create(userId, supplierData) {
        const variantSupplier = await prisma.variantSupplier.create({
            data: {user_id: userId, ...supplierData}
        });
        return variantSupplier;
    }

    static async update(userId, variantSupplierId, supplierData) {
        let variantSupplier = await prisma.variantSupplier.findOne({
            where: {id: variantSupplierId, user_id: userId}
        });
        if (!variantSupplier || (variantSupplier && variantSupplier.user_id !== userId)) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);
        }
        variantSupplier = await prisma.update({
            where: {id: variantSupplierId},
            data: supplierData
        });
        return variantSupplier;
    }

    static async delete(userId, variantSupplierId) {
        let variantSupplier = await prisma.variantSupplier.findOne({
            where: {id: variantSupplierId, user_id: userId}
        });
        if (!variantSupplier || (variantSupplier && variantSupplier.user_id !== userId)) {
            throw new NotFoundError(`Variant Supplier with id ${variantSupplierId} not found`);
        }
        await prisma.variantSupplier.delete({
            where: {id: variantSupplierId}
        });
    }
}

module.exports = VariantSupplierServices;