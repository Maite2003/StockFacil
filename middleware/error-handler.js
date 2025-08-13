const { StatusCodes } = require('http-status-codes');

const ErrorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later"
    }

    // unique constraint prisma
    if (err.code && err.code === 'P2002') {
        customError.msg = `${err.meta.target.filter((field) => field !== 'user_id')} is already in use, please use another one`;
    }

    // foreign key error prisma
    if (err.code && err.code === 'P2003' && err.name === 'PrismaClientKnownRequestError') {
        const parts = err.meta.constraint.split('_');
        const field = parts[parts.length - 3];
        customError.msg = `${field} id given is not valid (for table ${err.meta.modelName})`;
    }

    // column does not exists prisma
    if (err.code && err.code === 'P2010') {
        customError.msg = `${err.meta.message}`;
    }


    //res.status(500).json({err, message: err.message});
    res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = ErrorHandlerMiddleware;

