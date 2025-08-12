const SupplierServices = require('../services/supplier');
const VariantSupplierServices = require('../services/variant-supplier');
const { StatusCodes } = require('http-status-codes');

const getAllSuppliers = async (req, res) => {
    const suppliers = await SupplierServices.findAll(req.user.id);
    res.status(StatusCodes.OK).json({suppliers});
}

const getSupplier = async (req, res) => {
    const supplierId = Number(req.params.id);
    const supplier = await SupplierServices.findById(req.user.id, supplierId);
    res.status(StatusCodes.OK).json({supplier});
}

const updateSupplier = async (req, res) => {
    const supplierId = Number(req.params.id);
    const supplier = await SupplierServices.update(req.user.id, supplierId, {...req.body});
    res.status(StatusCodes.OK).json({supplier, length: supplier.length});
}

const createSupplier = async (req, res) => {
    const supplier = await SupplierServices.create(req.user.id, {...req.body});
    res.status(StatusCodes.CREATED).json({supplier});
}

const deleteSupplier = async (req, res) => {
    const supplierId = Number(req.params.id);
    await SupplierServices.delete(req.user.id, supplierId);
    res.status(StatusCodes.NO_CONTENT).send();
}

const getAllProductsFromSupplier = async (req, res) => {
    const supplierId = Number(req.params.supplierId);
    const products = await VariantSupplierServices.findAll(req.user.id, supplierId);
    res.status(StatusCodes.OK).json({ products });
}

module.exports = {
    getAllSuppliers,
    getSupplier,
    updateSupplier,
    createSupplier,
    deleteSupplier,
    getAllProductsFromSupplier
};