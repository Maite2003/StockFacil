const { body } = require('express-validator');

const variantSupplierCreateValidation = [
    body('supplier_id')
      .notEmpty()
      .withMessage('Must provide a supplier id')
      .isNumeric()
      .withMessage('Id of supplier must be numeric value'),

    body('variant_id')
      .notEmpty()
      .withMessage('Must provide a variant id')
      .isNumeric()
      .withMessage('Id of variant must be numeric value'),

    body('purchase_price')
      .notEmpty()
      .withMessage('Must provide a purchase price')
      .isNumeric()
      .withMessage('Purchase price must be numeric value'),

    body('is_primary_supplier')
      .optional()
      .isBoolean()
      .withMessage('is_orimary_supplier must be boolean')
]

const variantSupplierUpdateValidation = [
    body('purchase_price')
      .optional()
      .isNumeric()
      .withMessage('Purchase price must be numeric value'),

    body('is_primary_supplier')
      .optional()
      .isBoolean()
      .withMessage('is_orimary_supplier must be boolean'),

    body('supplier_id')
      .not()
      .exists('supplier_id cannot be modified'),

    body('variant_id')
      .not()
      .exists()
      .withMessage('variant_id cannot be modified'),
]

module.exports = {
    variantSupplierCreateValidation,
    variantSupplierUpdateValidation
};