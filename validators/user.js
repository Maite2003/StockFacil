const { body } = require('express-validator');

const userCreateValidation = [
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
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase, uppercase, and number'),

  body('business_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Business name must be between 2-50 characters')
];

const userLoginValidation = [
  body("email")
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Must provide a password")
]

const userUpdateValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    
  body('first_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('last_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
    
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('business_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Business name must be between 2-50 characters'),

  body('is_active')
    .optional()
    .isBoolean(),

  body('email_verified')
    .optional()
    .isBoolean()

];

module.exports = {
  userCreateValidation,
  userLoginValidation,
  userUpdateValidation
};