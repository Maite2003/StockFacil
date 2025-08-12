const express = require('express');
const router = express.Router();

const {
    getAllSuppliers,
    getSupplier,
    updateSupplier,
    createSupplier,
    deleteSupplier,
    getAllProductsFromSupplier
} = require('../controllers/supplier');
const handleValidationErrors = require('../middleware/validation');
const {
    basicPersonCreateValidator,
    basicPersonUpdateValidator
} = require('../validators/customer-supplier');

router.route('/').get(getAllSuppliers).post(basicPersonCreateValidator, handleValidationErrors, createSupplier);
router.route('/:id').get(getSupplier).patch(basicPersonUpdateValidator, handleValidationErrors, updateSupplier).delete(deleteSupplier);
router.route('/:supplierId/variants').get(getAllProductsFromSupplier);

module.exports = router;