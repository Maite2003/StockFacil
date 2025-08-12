const VariantSupplierServices = require('../services/variant-supplier');
const { StatusCodes } = require('http-status-codes');

const getVariantSupplier = async (req, res) => {
    const variantSupplierId = Number(req.params.id);
    const variantSupplier = await VariantSupplierServices.findOne(req.user.id, variantSupplierId);
    res.status(StatusCodes.OK).json({ variantSupplier });
}

const createVariantSupplier = async (req, res) => {
    const variantSupplier = await VariantSupplierServices.create(req.user.id, {...req.body});
    res.status(StatusCodes.CREATED).json({ variantSupplier });
}

const updateVariantSupplier = async (req, res) => {
    const variantSupplierId = Number(req.params.id);
    const { purchase_price, is_primary_supplier } = req.body;
    const updateData = {};
    if (purchase_price !== undefined) updateData.purchase_price = purchase_price;
    if (is_primary_supplier !== undefined) updateData.is_primary_supplier = is_primary_supplier;

    if (Object.keys(updateData).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No data to update' });
    }

    const variantSupplier = await VariantSupplierServices.update(req.user.id, variantSupplierId, {...updateData});
    res.status(StatusCodes.OK).json({variant_supplier: variantSupplier});
}

const deleteVariantSupplier = async (req, res) => {
    const variantSupplierId = Number(req.params.id);
    VariantSupplierServices.delete(req.user.id, variantSupplierId);
    res.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    getVariantSupplier,
    createVariantSupplier,
    updateVariantSupplier,
    deleteVariantSupplier
};