
const { StatusCodes } = require('http-status-codes'); 
const { NotFoundError } = require('../errors');

const NotFoundMiddleware = (req, res) => {
    throw new NotFoundError('Route not found');
}

module.exports = NotFoundMiddleware;