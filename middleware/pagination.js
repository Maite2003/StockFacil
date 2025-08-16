const { parsePaginationParams } = require('../utils/pagination');

/**
 * Middleware to parse and validate pagination parameters
 * Adds pagination params to req.pagination
 */
const paginationMiddleware = (req, res, next) => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query);
    
    req.pagination = {
      page,
      limit,
      offset
    };
    
    next();
  } catch (error) {
    return res.status(400).json({
      msg: 'Invalid pagination parameters'
    });
  }
};

module.exports = paginationMiddleware;