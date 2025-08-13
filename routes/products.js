
const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');
const {
    productCreateValidation,
    productUpdateValidation
} = require('../validators/product');
const {
    getAllProductVariants,
    getProductVariant,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
} = require('../controllers/product-variants');
const {
    productVariantCreateValidation,
    productVariantUpdateValidation
} = require('../validators/product-variant');
const handleValidationErrors = require('../middleware/validation');
const notValidFields = require('../validators/not-valid');

router.route('/').get(getAllProducts).post(notValidFields, productCreateValidation, handleValidationErrors, createProduct);
router.route('/:id').get(getProduct).patch(notValidFields, productUpdateValidation, handleValidationErrors, updateProduct).delete(deleteProduct);

// variants
router.route('/:productId/variants').get(getAllProductVariants).post(notValidFields, productVariantCreateValidation, handleValidationErrors, createProductVariant);
router.route('/:productId/variants/:id').get(getProductVariant).patch(notValidFields, productVariantUpdateValidation, handleValidationErrors, updateProductVariant).delete(deleteProductVariant);

module.exports = router;