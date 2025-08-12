require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const { capitalize } = require('../utils/stringUtils');
const { NotFoundError, UnauthenticatedError } = require('../errors');

class UserServices {
    static async authenticate(email, password) {
        const user = await this.findByEmail(email);
        if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
        throw new UnauthenticatedError('Invalid credentials');
        }

        return user;
    }

    static createJWT(userId, name, last_name) {
        return jwt.sign({
            userId, first_name: name, last_name
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        });
    }

    static async comparePassword(password, hashed) {
        const isMatch = await bcrypt.compare(password, hashed);
        return isMatch;
    }

    static async beforeSave(userData) {
        let processed = {};
        
        // Transform email
        if (userData.email) {
            processed.email = userData.email.toLowerCase().trim();
        }

        // Transform first name
        if (userData.first_name) {
            processed.first_name = capitalize(userData.first_name.toLowerCase().trim());
        }

        // Transform last name
        if (userData.last_name) {
            processed.last_name = capitalize(userData.last_name.toLowerCase().trim());
        }
        
        if (userData.business_name) {
            processed.business_name = capitalize(userData.business_name.trim());
        }

        // Hash password
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            processed.password_hash = await bcrypt.hash(userData.password, salt);
        }

        // Add timestamps
        processed.updatedAt = new Date();
        
        return processed;
    }

    static async create(userData) {
        const processed = await UserServices.beforeSave(userData);
        const user = await prisma.user.create({
            data: processed
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    static async register(userData) {
        const user = await this.create(userData);
        const token = this.createJWT(user.id, user.first_name, user.last_name);
        
        return {
            user: {name: user.first_name},
            token
        }
    }

    static async login(email, password) {
        const user = await this.authenticate(email, password);
        const token = this.createJWT(user.id, user.first_name, user.last_name);
        
        return {
            user: {name: user.first_name},
            token
        }
    }

    static async update(id, userData) {
        const processed = await this.beforeSave(userData);
        try {
            const updatedUser = await prisma.user.update({
                where: {id},
                data: processed
            });
        } catch (error) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
        const token = this.createJWT(updatedUser.id, updatedUser.first_name, updatedUser.last_name);
        
        return {
            user: {name: updatedUser.first_name},
            token
        };
    }

    static async delete(id) {
        try {
            await prisma.user.delete({
                where: {id}
            });
        } catch (error) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
    }

    static async findByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {email}
        });
        return user;
    }

    static async findById(id) {
        const user = await prisma.user.findUnique({
            where: {id}
        });
        return user;
    }
}


module.exports = UserServices;