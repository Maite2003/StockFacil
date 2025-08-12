
const { StatusCodes } = require('http-status-codes');
const productServices = require('../services/product');
const { NotFoundError } = require('../errors');

const getAllProducts = async (req, res) => {
    const products = await productServices.findAll(req.user.id);
    res.status(StatusCodes.OK).json({products, length: products.length});
};

const getProduct = async (req, res) => {
    const productId = Number(req.params.id);
    const product = await productServices.findById(req.user.id, productId);

    if (!product) {
        throw new NotFoundError(`Product with id ${productId} does not exists`);
    }
    res.status(StatusCodes.OK).json({product});
};

const createProduct = async (req, res) => {
    const product = await productServices.createProduct(req.user.id, {...req.body});
    res.status(StatusCodes.CREATED).json({product});
};

const updateProduct = async (req, res) => {
    const productId = Number(req.params.id);
    const product = await productServices.updateProduct(req.user.id, productId, {...req.body});
    res.status(StatusCodes.OK).json({product});
};

const deleteProduct = async (req, res) => {
    const productId = Number(req.params.id);
    await productServices.deleteProduct(req.user.id, productId);
    res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};