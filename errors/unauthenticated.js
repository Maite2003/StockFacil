const CustomAPIError = require('./custom-api');
const { StatusCodes } = require('http-status-codes');

class UnauthenticatedError extends CustomAPIError {
    constructor(msg) {
        super(msg);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}


module.exports = UnauthenticatedError;