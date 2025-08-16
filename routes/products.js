
const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');
const {
    productCreateValidation,
    productUpdateValidation
} = require('../validators/product');
const {
    getAllProductVariants,
    getProductVariant,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
} = require('../controllers/product-variants');
const {
    productVariantCreateValidation,
    productVariantUpdateValidation
} = require('../validators/product-variant');
const handleValidationErrors = require('../middleware/validation');
const paginationMiddleware = require('../middleware/pagination');
const notValidFields = require('../validators/not-valid');

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with an automatic default variant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - selling_price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Basic T-Shirt"
 *                 description: Product name
 *               selling_price:
 *                 type: number
 *                 example: 29.99
 *                 description: Product selling price
 *               description:
 *                 type: string
 *                 example: "100% cotton T-shirt, available in various sizes"
 *                 description: Optional product description
 *               category_id:
 *                 type: integer
 *                 example: 5
 *                 description: ID of the category this product belongs to
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * 
*   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products for the authenticated user with their variants included
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProductsResponse'
 *             example:
 *               products:
 *                 - id: 1
 *                   name: "Premium Craft Beer Kit"
 *                   description: "Complete brewing kit"
 *                   selling_price: 89.99
 *                   category:
 *                     id: 1
 *                     name: "Beer Making Kits"
 *                   variants:
 *                     - id: 1
 *                       variant_name: "Default"
 *                       stock: 50
 *                       selling_price_modifier: 0
 *                       min_stock_alert: 5
 *                       enable_stock_alerts: true
 *                       is_default: true
 *                       attributes: null
 *                   total_stock: 50
 *                   created_at: "2025-08-16T10:30:00.000Z"
 *                   updated_at: "2025-08-16T10:30:00.000Z"
 *               pagination:
 *                 currentPage: 1
 *                 totalPages: 5
 *                 totalItems: 48
 *                 itemsPerPage: 10
 *                 hasNextPage: true
 *                 hasPreviousPage: false
 *                 nextPage: 2
 *                 previousPage: null
 *                 startItem: 1
 *                 endItem: 10
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

router.route('/').get(paginationMiddleware, getAllProducts).post(notValidFields, productCreateValidation, handleValidationErrors, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieves a specific product with all its variants and category information
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
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
 *     summary: Update a product
 *     description: Updates the specified fields of an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update
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
 *               name:
 *                 type: string
 *                 example: "Premium T-Shirt"
 *                 description: New product name
 *               selling_price:
 *                 type: number
 *                 example: 39.99
 *                 description: New selling price
 *               description:
 *                 type: string
 *                 example: "Premium organic cotton T-shirt"
 *                 description: New product description
 *               category_id:
 *                 type: integer
 *                 example: 8
 *                 description: New category ID
 *           examples:
 *             partial_update:
 *               summary: Partial update
 *               value:
 *                 selling_price: 34.99
 *                 description: "Updated product description"
 *             full_update:
 *               summary: Full update
 *               value:
 *                 name: "Deluxe T-Shirt"
 *                 selling_price: 49.99
 *                 description: "Highest quality T-shirt available"
 *                 category_id: 10
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
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
 *     summary: Delete a product
 *     description: Deletes a product and all its associated variants (cascading delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Product deleted successfully (no content)
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
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

router.route('/:id').get(getProduct).patch(notValidFields, productUpdateValidation, handleValidationErrors, updateProduct).delete(deleteProduct);

// variants

/**
 * @swagger
 * /products/{productId}/variants:
 *   get:
 *     tags: [Product Variants]
 *     summary: Get all variants for a product with pagination
 *     description: Retrieve all variants belonging to a specific product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID to get variants for
 *         schema:
 *           type: integer
 *           example: 1
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         required: false
 *         schema:
 *           type: string
 *           enum: [variant_name, stock, selling_price_modifier, min_stock_alert, is_default, created_at, updated_at]
 *           default: variant_name
 *           example: variant_name
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Paginated list of product variants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVariantsResponse'
 *             example:
 *               variants:
 *                 - id: 1
 *                   variant_name: "Default"
 *                   stock: 50
 *                   selling_price_modifier: 0
 *                   min_stock_alert: 5
 *                   enable_stock_alerts: true
 *                   is_default: true
 *                   attributes: null
 *                   created_at: "2025-08-16T10:30:00.000Z"
 *                   updated_at: "2025-08-16T10:30:00.000Z"
 *                 - id: 2
 *                   variant_name: "Large"
 *                   stock: 30
 *                   selling_price_modifier: 10.00
 *                   min_stock_alert: 3
 *                   enable_stock_alerts: true
 *                   is_default: false
 *                   attributes: {"size": "Large"}
 *                   created_at: "2025-08-16T10:30:00.000Z"
 *                   updated_at: "2025-08-16T10:30:00.000Z"
 *               pagination:
 *                 currentPage: 1
 *                 totalPages: 1
 *                 totalItems: 2
 *                 itemsPerPage: 10
 *                 hasNextPage: false
 *                 hasPreviousPage: false
 *                 nextPage: null
 *                 previousPage: null
 *                 startItem: 1
 *                 endItem: 2
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
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
 *   post:
 *     tags: [Product Variants]
 *     summary: Create a new product variant
 *     description: Create a new variant for a specific product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID to create variant for
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variant_name
 *             properties:
 *               variant_name:
 *                 type: string
 *                 description: Name of the variant
 *                 example: "Size L"
 *               selling_price_modifier:
 *                 type: number
 *                 description: Price modifier (positive or negative)
 *                 example: 10.50
 *               stock:
 *                 type: integer
 *                 description: Initial stock quantity
 *                 example: 20
 *               min_stock_alert:
 *                 type: integer
 *                 description: Minimum stock level for alerts
 *                 example: 5
 *               enable_stock_alerts:
 *                 type: boolean
 *                 description: Whether to enable stock alerts for this variant
 *                 example: true
 *               attributes:
 *                 type: object
 *                 description: Custom attributes for the variant
 *                 example: {"color": "red", "material": "cotton"}
 *           example:
 *             variant_name: "Size L"
 *             selling_price_modifier: 15.00
 *             stock: 30
 *             min_stock_alert: 10
 *             enable_stock_alerts: true
 *             attributes: {"color": "green", "size": "large"}
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variant:
 *                   $ref: '#/components/schemas/ProductVariant'
 *             example:
 *               variant:
 *                 id: 3
 *                 variant_name: "Size L"
 *                 stock: 30
 *                 selling_price_modifier: 15.00
 *                 min_stock_alert: 10
 *                 enable_stock_alerts: true
 *                 is_default: false
 *                 attributes: {"color": "green", "size": "large"}
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *       400:
 *         description: Validation error
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
 *       404:
 *         description: Product not found
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
*/

router.route('/:productId/variants').get(paginationMiddleware, getAllProductVariants).post(notValidFields, productVariantCreateValidation, handleValidationErrors, createProductVariant);

/**
 * @swagger
 * /products/{productId}/variants/{id}:
 *   get:
 *     tags: [Product Variants]
 *     summary: Get a specific product variant
 *     description: Retrieve a specific variant by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID that owns the variant
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant ID
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Product variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variant:
 *                   $ref: '#/components/schemas/ProductVariant'
 *             example:
 *               variant:
 *                 id: 2
 *                 variant_name: "Size M"
 *                 stock: 15
 *                 selling_price_modifier: 5.00
 *                 min_stock_alert: 3
 *                 enable_stock_alerts: true
 *                 is_default: false
 *                 attributes: {"color": "blue"}
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found or doesn't belong to the product
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
 *   patch:
 *     tags: [Product Variants]
 *     summary: Update a product variant
 *     description: Update a specific variant's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID that owns the variant
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant ID to update
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variant_name:
 *                 type: string
 *                 description: Name of the variant
 *                 example: "Size M Updated"
 *               selling_price_modifier:
 *                 type: number
 *                 description: Price modifier (positive or negative)
 *                 example: 8.00
 *               stock:
 *                 type: integer
 *                 description: Current stock quantity
 *                 example: 25
 *               min_stock_alert:
 *                 type: integer
 *                 description: Minimum stock level for alerts
 *                 example: 8
 *               enable_stock_alerts:
 *                 type: boolean
 *                 description: Whether to enable stock alerts for this variant
 *                 example: false
 *               attributes:
 *                 type: object
 *                 description: Custom attributes for the variant
 *                 example: {"color": "navy", "material": "denim"}
 *           example:
 *             variant_name: "Size M Updated"
 *             selling_price_modifier: 8.00
 *             stock: 25
 *             min_stock_alert: 8
 *             enable_stock_alerts: false
 *             attributes: {"color": "navy", "material": "denim"}
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variant:
 *                   $ref: '#/components/schemas/ProductVariant'
 *             example:
 *               variant:
 *                 id: 2
 *                 variant_name: "Size M Updated"
 *                 stock: 25
 *                 selling_price_modifier: 8.00
 *                 min_stock_alert: 8
 *                 enable_stock_alerts: false
 *                 is_default: false
 *                 attributes: {"color": "navy", "material": "denim"}
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T11:45:00.000Z"
 *       400:
 *         description: Validation error
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
 *       404:
 *         description: Variant not found or doesn't belong to the product
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
 *   delete:
 *     tags: [Product Variants]
 *     summary: Delete a product variant
 *     description: Delete a specific product variant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID that owns the variant
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: id
 *         in: path
 *         required: true
 *         description: Variant ID to delete
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       204:
 *         description: Product variant deleted successfully (no content)
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found or doesn't belong to the product
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
 */

router.route('/:productId/variants/:id').get(getProductVariant).patch(notValidFields, productVariantUpdateValidation, handleValidationErrors, updateProductVariant).delete(deleteProductVariant);

module.exports = router;