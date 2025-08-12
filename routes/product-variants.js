const express = require('express');
const router = express.Router();

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

router.route('/').get(getAllProductVariants).post(productVariantCreateValidation, handleValidationErrors, createProductVariant);
router.route('/:id').get(getProductVariant).patch(productVariantUpdateValidation, handleValidationErrors, updateProductVariant).delete(deleteProductVariant);

module.exports = router;