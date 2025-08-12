const { body } = require('express-validator');

const categoryCreateValidation = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage('Must provide category name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2 and 50 characters'),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Category description must be less than 200 characters'),

    body("parent_id")
      .optional()
      .isInt()
      .withMessage("Parent id must be an int"),

    body("level")
      .optional()
      .isInt()
      .withMessage("Category level must be int")
];

const categoryUpdateValidation = [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2 and 50 characters'),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Category description must be less than 200 characters'),
];

module.exports = {
    categoryCreateValidation,
    categoryUpdateValidation
};