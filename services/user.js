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

        delete user.password_hash;
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

    static async beforeSave(data) {
        const allowedFields = ['email', 'first_name',
            'last_name', 'business_name', 'is_active', 'email_verified'
        ];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });
        
        // Transform email
        if (cleanData.email) {
            cleanData.email = cleanData.email.toLowerCase().trim();
        }

        // Transform first name
        if (cleanData.first_name) {
            cleanData.first_name = capitalize(cleanData.first_name.toLowerCase().trim());
        }

        // Transform last name
        if (cleanData.last_name) {
            cleanData.last_name = capitalize(cleanData.last_name.toLowerCase().trim());
        }
        
        if (cleanData.business_name) {
            cleanData.business_name = capitalize(cleanData.business_name.trim());
        }

        // Hash password
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            cleanData.password_hash = await bcrypt.hash(data.password, salt);
        }
        
        return cleanData;
    }

    static async create(userData) {
        const processed = await UserServices.beforeSave(userData);
        const user = await prisma.user.create({
            data: processed,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                business_name: true,
                is_active: true,
                email_verified: true,
                created_at: true,
                updated_at: true
            }
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
                data: processed,
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    business_name: true,
                    is_active: true,
                    email_verified: true,
                    created_at: true,
                    updated_at: true
                }
            });
            const token = this.createJWT(updatedUser.id, updatedUser.first_name, updatedUser.last_name);
        
            return {
                user: {name: updatedUser.first_name},
                token
            };
        } catch (error) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
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
            where: {id},
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                business_name: true,
                is_active: true,
                email_verified: true,
                created_at: true,
                updated_at: true
            }
        });
        return user;
    }
}


module.exports = UserServices;