/**
 * Pagination utility functions for consistent API responses
 */

/**
 * Calculate pagination metadata
 * @param {number} page - Current page (1-based)
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} Pagination metadata
 */
const calculatePagination = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    startItem: ((page - 1) * limit) + 1,
    endItem: Math.min(page * limit, totalItems)
  };
};

/**
 * Parse and validate pagination parameters from query string
 * @param {Object} query - Express req.query object
 * @returns {Object} Validated pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10)); // Max 100 items per page
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Format paginated response consistently
 * @param {Array} items - Array of items for current page
 * @param {Object} pagination - Pagination metadata
 * @param {string} itemsKey - Key name for items array (e.g., 'products', 'customers')
 * @returns {Object} Formatted response
 */
const formatPaginatedResponse = (items, pagination, itemsKey = 'items') => {
  return {
    [itemsKey]: items,
    pagination
  };
};

module.exports = {
  calculatePagination,
  parsePaginationParams,
  formatPaginatedResponse
};

