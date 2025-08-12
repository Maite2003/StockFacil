const { body } = require('express-validator');

const basicPersonCreateValidator = [
    body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail() // Automatically lowercase and trim
    .notEmpty()
    .withMessage('Email is required'),
    
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),

  body('company')
  .optional()
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Company name must be between 2-50 characters'),

  body('phone')
    .optional()
    .trim()
    .custom(value => {
      // remove characters except + or numbers
      const cleaned = value.replace(/[\s\-\(\)]/g, '');
      
      // must start with + and have between 8-15 characters
      const pattern = /^\+\d{8,15}$/;
      
      if (!pattern.test(cleaned)) {
        throw new Error('Phone must be in international format starting with + (e.g., +5492238547123)');
      }
      
      return true;
    })
    .customSanitizer(value => {
      // Limpiar y normalizar el número
      return value.replace(/[\s\-\(\)]/g, '');
    })

]

const basicPersonUpdateValidator = [
    body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(), // Automatically lowercase and trim
    
  body('first_name')
    .trim()
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('last_name')
    .trim()
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),

    body('company')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Company name must be between 2-50 characters'),

    body('phone')
      .optional()
      .trim()
      .custom(value => {
      // remove characters except + or numbers
      const cleaned = value.replace(/[\s\-\(\)]/g, '');
      
      // must start with + and have between 8-15 characters
      const pattern = /^\+\d{8,15}$/;
      
      if (!pattern.test(cleaned)) {
        throw new Error('Phone must be in international format starting with + (e.g., +5492238547123)');
      }
      
      return true;
    })
    .customSanitizer(value => {
      // Limpiar y normalizar el número
      return value.replace(/[\s\-\(\)]/g, '');
    })
];


module.exports = {
    basicPersonCreateValidator,
    basicPersonUpdateValidator
};