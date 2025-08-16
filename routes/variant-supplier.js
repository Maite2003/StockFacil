const express = require('express');
const router = express.Router()

const {
    getVariantSupplier,
    createVariantSupplier,
    updateVariantSupplier,
    deleteVariantSupplier
} = require('../controllers/variant-supplier');
const {
    variantSupplierCreateValidation,
    variantSupplierUpdateValidation
} = require('../validators/variant-supplier');
const handleValidationErrors = require('../middleware/validation');
const notValidFields = require('../validators/not-valid');

/**
 * @swagger
 * /variant-suppliers:
 *   post:
 *     tags: [Variant-Suppliers]
 *     summary: Create variant-supplier relationship
 *     description: Create a new relationship between a variant and a supplier with purchase price
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_id
 *               - variant_id
 *               - purchase_price
 *             properties:
 *               supplier_id:
 *                 type: integer
 *                 description: ID of the supplier
 *                 example: 1
 *               variant_id:
 *                 type: integer
 *                 description: ID of the product variant
 *                 example: 5
 *               purchase_price:
 *                 type: number
 *                 description: Purchase price from this supplier
 *                 example: 150.00
 *               is_primary_supplier:
 *                 type: boolean
 *                 description: Whether this is the primary supplier for this variant
 *                 example: true
 *           example:
 *             supplier_id: 1
 *             variant_id: 5
 *             purchase_price: 150.00
 *             is_primary_supplier: true
 *     responses:
 *       201:
 *         description: Variant-supplier relationship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variantSupplier:
 *                   $ref: '#/components/schemas/VariantSupplier'
 *             example:
 *               variantSupplier:
 *                 id: 3
 *                 variant:
 *                   id: 5
 *                   variant_name: "Size M"
 *                   product:
 *                     id: 1
 *                     name: "Cotton T-Shirt"
 *                   stock: 20
 *                 is_primary_supplier: true
 *                 purchase_price: 150.00
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *       400:
 *         description: Validation error or duplicate relationship
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   msg: "Purchase price is required"
 *               duplicate_relationship:
 *                 summary: Relationship already exists
 *                 value:
 *                   msg: "Variant-supplier relationship already exists"
 *       401:
 *         description: Authentication token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Authentication invalid"
 *       404:
 *         description: Variant or supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Variant or supplier not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/').post(notValidFields, variantSupplierCreateValidation, handleValidationErrors, createVariantSupplier);

/**
 * @swagger
 * /variant-suppliers/{id}:
 *   get:
 *     tags: [Variant-Suppliers]
 *     summary: Get specific variant-supplier relationship
 *     description: Retrieve a specific variant-supplier relationship by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant-supplier relationship ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Variant-supplier relationship retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variantSupplier:
 *                   $ref: '#/components/schemas/VariantSupplier'
 *             example:
 *               variantSupplier:
 *                 id: 1
 *                 variant:
 *                   id: 5
 *                   variant_name: "Size M"
 *                   product:
 *                     id: 1
 *                     name: "Cotton T-Shirt"
 *                   stock: 20
 *                 is_primary_supplier: true
 *                 purchase_price: 150.00
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant-supplier relationship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   patch:
 *     tags: [Variant-Suppliers]
 *     summary: Update variant-supplier relationship
 *     description: Update purchase price or primary supplier status for a variant-supplier relationship
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant-supplier relationship ID to update
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
 *               purchase_price:
 *                 type: number
 *                 description: New purchase price from this supplier
 *                 example: 175.00
 *               is_primary_supplier:
 *                 type: boolean
 *                 description: Whether this should be the primary supplier for this variant
 *                 example: false
 *           example:
 *             purchase_price: 175.00
 *             is_primary_supplier: false
 *     responses:
 *       200:
 *         description: Variant-supplier relationship updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variant_supplier:
 *                   $ref: '#/components/schemas/VariantSupplier'
 *             example:
 *               variant_supplier:
 *                 id: 1
 *                 variant:
 *                   id: 5
 *                   variant_name: "Size M"
 *                   product:
 *                     id: 1
 *                     name: "Cotton T-Shirt"
 *                   stock: 20
 *                 is_primary_supplier: false
 *                 purchase_price: 175.00
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T11:45:00.000Z"
 *       400:
 *         description: Validation error or no data to update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant-supplier relationship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   delete:
 *     tags: [Variant-Suppliers]
 *     summary: Delete variant-supplier relationship
 *     description: Delete a specific variant-supplier relationship
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant-supplier relationship ID to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Variant-supplier relationship deleted successfully (no content)
 *       401:
 *         description: Authentication token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant-supplier relationship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 */

router.route('/:id').get(getVariantSupplier).delete(deleteVariantSupplier).patch(notValidFields, variantSupplierUpdateValidation, handleValidationErrors, updateVariantSupplier);

module.exports = router;