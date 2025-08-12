
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
const handleValidationErrors = require('../middleware/validation');

router.route('/').get(getAllProducts).post(productCreateValidation, handleValidationErrors, createProduct);
router.route('/:id').get(getProduct).patch(productUpdateValidation, handleValidationErrors, updateProduct).delete(deleteProduct);

module.exports = router;