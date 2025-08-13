
const { StatusCodes } = require('http-status-codes'); 

const NotFoundMiddleware = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ 
        message: 'Route not found',
        url: req.originalUrl,
        method: req.method
    });
}

module.exports = NotFoundMiddleware;