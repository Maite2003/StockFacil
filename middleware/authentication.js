require('dotenv').config()
const { UnauthenticatedError, BadRequestError } = require("../errors");
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');

const authenticationMiddleware = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeaders.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: {id: payload.userId}
        });

        if (!user || !user.is_active) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = authenticationMiddleware;