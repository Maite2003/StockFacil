const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class CategoryServices {

    static beforeSave(data) {
        const allowedFields = ['name', 'description', 'parent_id'];

        const cleanData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
            cleanData[field] = data[field];
            }
        });

        if (cleanData.name) {
            cleanData.name = capitalize(cleanData.name.trim())
        }

        if (cleanData.description) {
            cleanData.description = capitalize(cleanData.description.trim());
        }
        
        return cleanData;
    }

    static async updateLevel(userId, data) {
        const parent = await prisma.category.findFirst({
            where: {user_id: userId, id: data.parent_id},
            select: {
                level: true
            }
        });
        if (!parent) {
            throw new NotFoundError(`Parent category with id ${data.parent_id} not found`);
        }
        return parent.level + 1;
    }

    static async findAll(userId) {
        const categories = await prisma.category.findMany({
            where: {user_id: userId},
            select: {
                id: true,
                name: true,
                description: true,
                level: true,
                parent: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return categories;
    }

    static async findById(userId, id) {
        const category = await prisma.category.findFirst({
            where: {id, user_id:userId},
            select: {
                id: true,
                name: true,
                description: true,
                level: true,
                parent: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!category) {
            throw new NotFoundError(`Category with id ${id} not found`);
        }
        return category;
    }

    static async create(userId, categoryData) {
        let processed = this.beforeSave(categoryData);

        // if has parent, get the level of the parent and add one
        if (processed.parent_id) {
            processed.level = await this.updateLevel(userId, processed);
        } else {
            processed.level = 0;
        }

        const category = await prisma.category.create({
            data: {user_id: userId, ...processed},
            select: {
                id: true,
                name: true,
                description: true,
                level: true,
                parent: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return category;
    }

    static async update(userId, categoryId, categoryData) {
        let category = await prisma.category.findFirst({
            where: {id: categoryId, user_id: userId}
        });
        if (!category) {
            throw new NotFoundError(`Category with id ${categoryId} does not exists`);
        }
        const processed = this.beforeSave(categoryData);
        // if has parent, get the level of the parent and add one
        if (processed.parent_id) {
            processed.level = await this.updateLevel(userId, processed);
        }
        category = await prisma.category.update({
            where: {id: categoryId, user_id: userId},
            data: processed,
            select: {
                id: true,
                name: true,
                description: true,
                level: true,
                parent: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return category;
    }

    static async delete(userId, categoryId) {
        let category = await prisma.category.findFirst({
            where: {id: categoryId, user_id: userId}
        });
        if (!category) {
            throw new NotFoundError(`Category with id ${categoryId} does not exists`);
        }
        await prisma.category.delete({
            where: {id: categoryId}
        });
    }
    
}

module.exports = CategoryServices;