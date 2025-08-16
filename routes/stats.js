const express = require('express');
const router = express.Router();

const {
    getInventoryStats,
    getAgendaStats
} = require('../controllers/stats');

/**
 * @swagger
 * /stats/inventory:
 *   get:
 *     summary: Get inventory statistics and stock alerts
 *     description: Retrieves comprehensive inventory statistics including total products count, low stock alerts, and out of stock items. Low stock alerts are triggered when variant stock is above 0 but at or below the minimum stock alert threshold. Out of stock items have zero stock remaining.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns inventory statistics with product counts and stock alert information
 *         content:
 *           application/json:        
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   example: 5
 *                 lowStockAlerts:
 *                   type: integer
 *                   example: 2
 *                 outOfStockVariants: 
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized
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

router.route('/inventory').get(getInventoryStats);

/**
 * @swagger
 * /stats/agenda:
 *   get:
 *     summary: Get agenda and contact statistics
 *     description: Retrieves statistics related to business contacts and agenda, including total number of customers and suppliers registered in the system. Useful for dashboard overview and business relationship management.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns agenda statistics with customer and supplier counts
 *         content:
 *           application/json:        
 *             schema:
 *               type: object
 *               properties:
 *                 totalSuppliers:
 *                   type: integer
 *                   example: 5
 *                 totalCustomers:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: Unauthorized
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

router.route('/agenda').get(getAgendaStats);


module.exports = router;