const { body } = require('express-validator');

const productVariantCreateValidation = [
    body('variant_name')
      .trim()
      .notEmpty()
      .withMessage('Product name must not be empty')
      .isLength({ min:3, max:50 })
      .withMessage('Product name must be between 3 and 50 characters'),

    body('selling_price_modifier')
    .notEmpty()
    .withMessage('Must provide a selling price modifier')
    .isFloat({ min: -99999.99, max: 99999999.99 })
    .withMessage('Price must be a float between -99999.99 and 99,999,999.99'),

    body('stock')
    .notEmpty()
    .withMessage('Must provide stock')
      .isInt({ min: 0, max: 99999 })
      .withMessage('Stock has to be a number between 0 and 99999'),

    body('min_stock_alert')
      .optional()
      .isInt(),

    body('enable_stock_alerts')
      .optional()
      .isBoolean()

];

const productVariantUpdateValidation = [
  body('variant_name')
      .optional()
      .trim()
      .isLength({ min:3, max:50 })
      .withMessage('Product name must be between 3 and 50 characters'),

    body('selling_price_modifier')
    .optional()
    .isFloat({ min: -99999.99, max: 99999999.99 })
    .withMessage('Price must be a float between -99999.99 and 99,999,999.99'),

    body('stock')
      .optional()
      .isInt({ min: 0, max: 99999 })
      .withMessage('Stock has to be a number between 0 and 99999'),

    body('min_stock_alert')
      .optional()
      .isInt(),

    body('enable_stock_alerts')
      .optional()
      .isBoolean()
];

module.exports = {
    productVariantCreateValidation,
    productVariantUpdateValidation
};