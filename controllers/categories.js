
const { StatusCodes }= require('http-status-codes');
const CategoryServices = require('../services/category');
const { NotFoundError } = require('../errors');

const getAllCategories = async (req, res) => {
    const categories = await CategoryServices.findAll(req.user.id);
    res.status(StatusCodes.OK).json({categories, length: categories.length})
}

const getCategory = async (req, res) => {
    const categoryId = req.params.id;
    const category = await CategoryServices.findById(req.user.id, categoryId);
    res.status(StatusCodes.OK).json(category);
}

const createCategory = async (req, res) => {
    const category = await CategoryServices.create(req.user.id, {...req.body});
    res.status(StatusCodes.CREATED).json({category});
}

const updateCategory = async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await CategoryServices.update(req.user.id, categoryId, {...req.body});
    res.status(StatusCodes.OK).json({category});
}

const deleteCategory = async (req, res) => {
    const categoryId = Number(req.params.id);
    await CategoryServices.delete(req.user.id, categoryId);
    res.status(StatusCodes.NO_CONTENT).send();
}


module.exports = {
    getAllCategories, 
    getCategory, 
    createCategory,
    updateCategory,
    deleteCategory
};