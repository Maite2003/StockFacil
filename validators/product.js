const { body } = require('express-validator');

const productCreateValidation = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name must not be empty')
      .isLength({ min:3, max:50 })
      .withMessage('Product name must be between 3 and 50 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max:200 })
      .withMessage('Description must be less than 200 characters'),

    body('selling_price')
      .notEmpty()
      .isFloat({ min: 0.01, max: 99999999.99 })
      .withMessage('Price must be a float between 0.01 and 99,999,999.99'),

    body('category_id')
      .notEmpty()
      .toInt(),

    body('has_variants')
      .optional()
      .isBoolean(),

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
]

const productUpdateValidation = [
    body('name')
      .optional()
      .trim()
      .isLength({ min:3, max:50 })
      .withMessage('Product name must be between 3 and 50 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max:200 })
      .withMessage('Description must be less than 200 characters'),

    body('selling-price')
      .optional()
      .isFloat({ min: 0.01, max: 99999999.99 })
      .withMessage('Price must be between 0.01 and 99,999,999.99'),

    body('category_id')
      .optional(),

    body('has_variants')
      .optional()
      .isBoolean(),

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
]   

module.exports = {
    productCreateValidation,
    productUpdateValidation
};