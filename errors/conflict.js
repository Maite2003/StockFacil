const CustomAPIError = require('./custom-api');
const { StatusCodes } = require('http-status-codes');

class ConflictError extends CustomAPIError {
    constructor(msg) {
        super(msg);
        this.statusCode = StatusCodes.CONFLICT;
    }
}

module.exports = ConflictError;