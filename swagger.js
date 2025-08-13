const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StockFacil API',
      version: '1.0.0',
      description: 'API para gestión integral de inventarios, clientes y proveedores',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 22 },
            name: { type: 'string', example: "T-Shirt" },
            selling_price: { type: 'number', example: 12.54 },
            description: { type: 'string', nullable: true, example: "Cotton T-Shirt" },
            category: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 10 },
                name: { type: 'string', example: 'Clothing' }
              }
            },
            variants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 14 },
                  variant_name: { type: 'string', example: "Oversize" },
                  stock: { type: 'integer', example: 7 },
                  selling_price_modifier: { type: 'number', example: 5.00 },
                  is_default: { type: 'boolean', example: false }
                }
              }
            },
            total_stock: { type: 'integer', example: 5.00 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ProductVariant: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 11 },
            variant_name: { type: 'string', example: 'Size S' },
            stock: { type: 'integer', example: 25 },
            selling_price_modifier: { type: 'number', example: 0.00 },
            min_stock_alert: { type: 'integer', example: 5 },
            enable_stock_alerts: { type: 'boolean', example: true },
            is_default: { type: 'boolean', example: false },
            attributes: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          }
        },
        Agenda: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 17 },
            first_name: { type: 'string', example: "John" },
            last_name: { type: 'string', example: "Doe"},
            email: { type: 'string', example: "JohnDoe@example.com" },
            phone: { type: 'string', nullable: true, example: "+1917444228"},
            company: { type: 'string', nullable: true, example: "CompanyName" },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            msg: { type: 'string' }
          }
        },
        Category: {
            type: "object",
            properties: {
                id: { type: "integer", example: 22},
                name: { type: "string", example: "T-Shirts" },
                description: { type: "string", example: "Clothes like t-shirts, shorts, sweaters, etcetera" },
                level: { type: "integer", example: 1 },
                parent: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 4},
                    name: { type: "string", example: "Clothing" }
                  }
                }
            }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 17 },
            first_name: { type: 'string', example: "John" },
            last_name: { type: 'string', example: "Doe"},
            email: { type: 'string', example: "JohnDoe@example.com" },
            business_name: { type: 'string', nullable: true, example: "CompanyName" },
            is_active: { type: "boolean", example: true },
            email_verified: { type: "boolean", example: false },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        VariantSupplier: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            variant: { 
              type: 'object',
              properties: {
                id: { type: "integer", example: 5 },
                variant_name: { type: "string", example: "T-Shirt" },
                product: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Clothing" }
                  }
                },
                stock: { type: "integer", example: 20 }
              }
            },
            is_primary_supplier: { type: 'boolean', example: true },
            purchase_price: { type: 'number', example: 150.00 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };