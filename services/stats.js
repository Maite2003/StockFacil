const prisma = require("../db/prisma");

class StatsServices {
    static async getInventoryStats(userId) {
        const [totalProducts, outOfStockVariants, lowStockAlerts] = await Promise.all([
            prisma.product.count({
                where: { user_id: userId } 
            }),


            prisma.productVariant.count({
                where: { user_id: userId, stock: 0 }
            }),
            
            
            prisma.$queryRaw`
                SELECT COUNT(*)::int AS count
                FROM product_variants pv
                WHERE pv.user_id = ${userId}
                AND pv.enable_stock_alerts = true
                AND pv.stock > 0
                AND pv.stock <= pv.min_stock_alert 
            `.then(result => result[0].count)
        ]);
        
        return {totalProducts, lowStockAlerts, outOfStockVariants};
    }

    static async getAgendaStats(userId) {
        const [totalSuppliers, totalCustomers] = await Promise.all([
            prisma.supplier.count({
                where: { user_id: userId } 
            }),

            prisma.customer.count({
                where: { user_id: userId } 
            }),
        ]);

        return {totalSuppliers, totalCustomers};
    }
}

module.exports = StatsServices;