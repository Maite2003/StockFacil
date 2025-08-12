const express = require('express');
const router = express.Router();

const {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer
} = require('../controllers/customers');
const handleValidationErrors = require('../middleware/validation');
const {
    basicPersonCreateValidator,
    basicPersonUpdateValidator
} = require('../validators/customer-supplier');

router.route('/').get(getAllCustomers).post(basicPersonCreateValidator, handleValidationErrors, createCustomer);
router.route('/:id').get(getCustomer).patch(basicPersonUpdateValidator, handleValidationErrors, updateCustomer).delete(deleteCustomer);

module.exports = router;