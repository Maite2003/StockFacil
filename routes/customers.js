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
const notValidFields = require('../validators/not-valid');
const paginationMiddleware = require('../middleware/pagination');

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers with pagination
 *     description: Retrieves a list of all customers for the authenticated user with optional search
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         required: false
 *         schema:
 *           type: string
 *           enum: [first_name, last_name, email, company, created_at, updated_at]
 *           default: first_name
 *           example: first_name
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCustomersResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new customer with contact information
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *                 description: Customer's first name
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *                 description: Customer's last name
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *                 description: Customer's email address
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: Customer's phone number (optional)
 *               company:
 *                 type: string
 *                 example: "Doe Industries"
 *                 description: Customer's company name (optional)
 *     responses:
 *       200:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Agenda'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/').get(paginationMiddleware, getAllCustomers).post(notValidFields, basicPersonCreateValidator, handleValidationErrors, createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     description: Retrieves a specific customer with all their contact information
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the customer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   patch:
 *     summary: Update a customer
 *     description: Updates the specified fields of an existing customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the customer to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Jane"
 *                 description: New customer's first name
 *               last_name:
 *                 type: string
 *                 example: "Smith"
 *                 description: New customer's last name
 *               email:
 *                 type: string
 *                 example: "jane.smith@example.com"
 *                 description: New customer's email address
 *               phone:
 *                 type: string
 *                 example: "+1987654321"
 *                 description: New customer's phone number
 *               company:
 *                 type: string
 *                 example: "Smith Corp"
 *                 description: New customer's company name
 *           examples:
 *             partial_update:
 *               summary: Partial update
 *               value:
 *                 phone: "+1555123456"
 *                 company: "Updated Company Name"
 *             full_update:
 *               summary: Full update
 *               value:
 *                 first_name: "Michael"
 *                 last_name: "Johnson"
 *                 email: "michael.johnson@newcompany.com"
 *                 phone: "+1444555666"
 *                 company: "Johnson Enterprises"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   delete:
 *     summary: Delete a customer
 *     description: Deletes a customer from the system
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the customer to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Customer deleted successfully (no content)
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/:id').get(getCustomer).patch(notValidFields, basicPersonUpdateValidator, handleValidationErrors, updateCustomer).delete(deleteCustomer);

module.exports = router;