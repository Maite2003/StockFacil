const express = require('express');
const router = express.Router();

const {
    getAllCategories, 
    getCategory, 
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');
const notValidFields = require('../validators/not-valid');
const handleValidationErrors = require('../middleware/validation');
const { categoryCreateValidation, categoryUpdateValidation } = require('../validators/category');

router.route('/').get(getAllCategories).post(notValidFields, categoryCreateValidation, handleValidationErrors, createCategory);
router.route('/:id').get(getCategory).patch(notValidFields, categoryUpdateValidation, handleValidationErrors, updateCategory).delete(deleteCategory);

module.exports = router;