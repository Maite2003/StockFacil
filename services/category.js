const prisma = require('../db/prisma');
const { NotFoundError } = require('../errors');
const { capitalize } = require('../utils/stringUtils');

class CategoryServices {

    static beforeSave(categoryData) {
        if (categoryData.name) {
            categoryData.name = capitalize(categoryData.name.trim())
        }

        if (categoryData.description) {
            categoryData.description = capitalize(categoryData.description.trim());
        }
        return categoryData;
    }

    static async findAll(userId) {
        const categories = await prisma.category.findMany({
            where: {user_id: userId}
        });
        return categories;
    }

    static async findById(userId, id) {
        const category = await prisma.category.findUnique({
            where: {id, user_id:userId}
        });
        if (!category) {
            throw new NotFoundError(`Category with id ${id} not found`);
        }
        return category;
    }

    static async create(userId, categoryData) {
        const processed = this.beforeSave(categoryData);
        const category = await prisma.category.create({
            data: {user_id: userId, ...processed}
        });

        return category;
    }

    static async update(userId, categoryId, categoryData) {
        try {
            const processed = this.beforeSave(categoryData);
            const category = await prisma.category.update({
                where: {id: categoryId, user_id: userId},
                data: processed
            });
            return category;
        } catch(error) {
            throw new NotFoundError(`Category with id ${categoryId} does not exists`);
        }
    }

    static async delete(userId, categoryId) {
        try {
            await prisma.category.delete({
                where: {id: categoryId, user_id:userId}
            });
        } catch(error) {
            throw new NotFoundError(`Category with id ${categoryId} does not exists`);
        }
    }
    
}

module.exports = CategoryServices;