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
const notValidFields = require('../validators/not-valid');

router.route('/').get(getAllSuppliers).post(notValidFields, basicPersonCreateValidator, handleValidationErrors, createSupplier);
router.route('/:id').get(getSupplier).patch(notValidFields, basicPersonUpdateValidator, handleValidationErrors, updateSupplier).delete(deleteSupplier);
router.route('/:supplierId/variants').get(getAllProductsFromSupplier);

module.exports = router;