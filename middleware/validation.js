const { validationResult } = require('express-validator');
const { BadRequestError } = require('../errors');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new BadRequestError(errorMessages.join(', '));
  }
  next();
};

module.exports = handleValidationErrors;