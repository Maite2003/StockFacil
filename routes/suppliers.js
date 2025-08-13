const express = require('express');
const router = express.Router();

const {
    getAllSuppliers,
    getSupplier,
    updateSupplier,
    createSupplier,
    deleteSupplier,
    getAllProductsFromSupplier
} = require('../controllers/supplier');
const handleValidationErrors = require('../middleware/validation');
const {
    basicPersonCreateValidator,
    basicPersonUpdateValidator
} = require('../validators/customer-supplier');
const notValidFields = require('../validators/not-valid');

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     description: Retrieves a list of all suppliers for the authenticated user
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agenda'
 *                 length:
 *                   type: integer
 *                   example: 8
 *                   description: Total number of suppliers returned
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Authentication Invalid"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 * 
 *   post:
 *     summary: Create a new supplier
 *     description: Creates a new supplier with contact information
 *     tags: [Suppliers]
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
 *                 example: "Alice"
 *                 description: Supplier's first name
 *               last_name:
 *                 type: string
 *                 example: "Johnson"
 *                 description: Supplier's last name
 *               email:
 *                 type: string
 *                 example: "alice.johnson@supplier.com"
 *                 description: Supplier's email address
 *               phone:
 *                 type: string
 *                 example: "+1987654321"
 *                 description: Supplier's phone number (optional)
 *               company:
 *                 type: string
 *                 example: "Johnson Supply Co"
 *                 description: Supplier's company name (optional)
 *     responses:
 *       200:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Supplier:
 *                   $ref: '#/components/schemas/Agenda'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Authentication Invalid"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 */

router.route('/').get(getAllSuppliers).post(notValidFields, basicPersonCreateValidator, handleValidationErrors, createSupplier);

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     description: Retrieves a specific supplier with all their contact information
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the supplier
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier:
 *                   $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Authentication Invalid"
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Supplier with id 45 not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 * 
 *   patch:
 *     summary: Update a supplier
 *     description: Updates the specified fields of an existing supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the supplier to update
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
 *                 example: "Robert"
 *                 description: New supplier's first name
 *               last_name:
 *                 type: string
 *                 example: "Wilson"
 *                 description: New supplier's last name
 *               email:
 *                 type: string
 *                 example: "robert.wilson@newsupplier.com"
 *                 description: New supplier's email address
 *               phone:
 *                 type: string
 *                 example: "+1555987654"
 *                 description: New supplier's phone number
 *               company:
 *                 type: string
 *                 example: "Wilson Industries"
 *                 description: New supplier's company name
 *           examples:
 *             partial_update:
 *               summary: Partial update
 *               value:
 *                 phone: "+1777888999"
 *                 company: "Updated Supplier Corp"
 *             full_update:
 *               summary: Full update
 *               value:
 *                 first_name: "Sarah"
 *                 last_name: "Davis"
 *                 email: "sarah.davis@davissupplies.com"
 *                 phone: "+1333444555"
 *                 company: "Davis Supplies LLC"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier:
 *                   $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Authentication Invalid"
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Supplier with id 45 not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 * 
 *   delete:
 *     summary: Delete a supplier
 *     description: Deletes a supplier from the system
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the supplier to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Supplier deleted successfully (no content)
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Authentication Invalid"
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Supplier with id 45 not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 */

router.route('/:id').get(getSupplier).patch(notValidFields, basicPersonUpdateValidator, handleValidationErrors, updateSupplier).delete(deleteSupplier);

/**
 * @swagger
 * /suppliers/{supplierId}/variants:
 *   get:
 *     tags: [Variant-Suppliers]
 *     summary: Get all variants for a supplier
 *     description: Retrieve all variant-supplier relationships for a specific supplier (useful for making purchases)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: supplierId
 *         in: path
 *         required: true
 *         description: Supplier ID to get variants for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Variant-supplier relationships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variant_suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VariantSupplier'
 *                 length:
 *                   type: integer
 *                   description: Total number of variant-supplier relationships
 *                   example: 2
 *             example:
 *               variant_suppliers:
 *                 - id: 1
 *                   variant:
 *                     id: 5
 *                     variant_name: "Size M"
 *                     product:
 *                       id: 1
 *                       name: "Cotton T-Shirt"
 *                     stock: 20
 *                   is_primary_supplier: true
 *                   purchase_price: 150.00
 *                   created_at: "2025-08-13T10:30:00.000Z"
 *                   updated_at: "2025-08-13T10:30:00.000Z"
 *                 - id: 2
 *                   variant:
 *                     id: 8
 *                     variant_name: "Size L"
 *                     product:
 *                       id: 2
 *                       name: "Premium Hoodie"
 *                     stock: 15
 *                   is_primary_supplier: false
 *                   purchase_price: 320.00
 *                   created_at: "2025-08-13T10:30:00.000Z"
 *                   updated_at: "2025-08-13T10:30:00.000Z"
 *               length: 2
 *       401:
 *         description: Authentication token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Authentication invalid"
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Supplier with id 12 not found"
 */

router.route('/:supplierId/variants').get(getAllProductsFromSupplier);

module.exports = router;