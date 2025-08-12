const { StatusCodes } = require('http-status-codes');
const ProductVariantServices = require('../services/product-variant');

const getAllProductVariants = async (req, res) => {
    const productId = Number(req.params.productId)
    const variants = await ProductVariantServices.findAll(req.user.id, productId);
    res.status(StatusCodes.OK).json({variants, length: variants.length});
}

const getProductVariant = async (req, res) => {
    const productId = Number(req.params.productId)
    const variantId = Number(req.params.id);
    const variant = await ProductVariantServices.findById(req.user.id, productId, variantId);
    res.status(StatusCodes.OK).json({variant});
}

const createProductVariant = async (req, res) => {
    const productId = Number(req.params.productId);
    const variant = await ProductVariantServices.create(req.user.id, productId, ...req.body);
    res.status(StatusCodes.CREATED).json({variant}); 
}

const updateProductVariant = async (req, res) => {
    const productId = Number(req.params.productId)
    const variantId = Number(req.params.id);
    const variant = await ProductVariantServices.update(req.user.id, productId, variantId, {...req.body});
    res.status(StatusCodes.OK).json({variant});
}

const deleteProductVariant = async (req, res) => {
    const productId = Number(req.params.productId)
    const variantId = Number(req.params.id);
    await ProductVariantServices.delete(req.user.id, productId, variantId);
    res.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    getAllProductVariants,
    getProductVariant,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
};