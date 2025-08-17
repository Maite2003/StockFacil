const BadRequestError = require('./bad-request');
const CustomAPIError = require('./custom-api');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unauthenticated');
const ConflictError = require('./conflict');

module.exports = {
    BadRequestError,
    CustomAPIError,
    NotFoundError,
    UnauthenticatedError,
    ConflictError
}