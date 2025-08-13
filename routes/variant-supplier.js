const express = require('express');
const router = express.Router()

const {
    getVariantSupplier,
    createVariantSupplier,
    updateVariantSupplier,
    deleteVariantSupplier
} = require('../controllers/variant-supplier');
const {
    variantSupplierCreateValidation,
    variantSupplierUpdateValidation
} = require('../validators/variant-supplier');
const handleValidationErrors = require('../middleware/validation');
const notValidFields = require('../validators/not-valid');

router.route('/').post(notValidFields, variantSupplierCreateValidation, handleValidationErrors, createVariantSupplier)
router.route('/:id').get(getVariantSupplier).delete(deleteVariantSupplier).patch(notValidFields, variantSupplierUpdateValidation, handleValidationErrors, updateVariantSupplier);

module.exports = router;