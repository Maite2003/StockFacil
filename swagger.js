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
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1,
              description: 'Current page number (1-based)'
            },
            totalPages: {
              type: 'integer',
              example: 5,
              description: 'Total number of pages'
            },
            totalItems: {
              type: 'integer',
              example: 48,
              description: 'Total number of items across all pages'
            },
            itemsPerPage: {
              type: 'integer',
              example: 10,
              description: 'Number of items per page'
            },
            hasNextPage: {
              type: 'boolean',
              example: true,
              description: 'Whether there is a next page'
            },
            hasPreviousPage: {
              type: 'boolean',
              example: false,
              description: 'Whether there is a previous page'
            },
            nextPage: {
              type: 'integer',
              nullable: true,
              example: 2,
              description: 'Next page number (null if no next page)'
            },
            previousPage: {
              type: 'integer',
              nullable: true,
              example: null,
              description: 'Previous page number (null if no previous page)'
            },
            startItem: {
              type: 'integer',
              example: 1,
              description: 'Item number of first item on current page'
            },
            endItem: {
              type: 'integer',
              example: 10,
              description: 'Item number of last item on current page'
            }
          }
        },
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
                },
                totalProducts: { type: "integer", example: 1}
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
                    name: { type: "string", example: "Clothing" },
                    selling_price: { type: "number", example: "25.00" }
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
        },
        // Paginated response schemas
        PaginatedProductsResponse: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            }
          }
        },
        PaginatedCustomersResponse: {
          type: 'object',
          properties: {
            customers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Customer'
              }
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            }
          }
        },
        PaginatedSuppliersResponse: {
          type: 'object',
          properties: {
            suppliers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Supplier'
              }
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            }
          }
        },
        PaginatedVariantsResponse: {
          type: 'object',
          properties: {
            variants: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProductVariant'
              }
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number (1-based)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page (max 100)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10
          }
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Search term to filter results',
          required: false,
          schema: {
            type: 'string',
            example: 'beer'
          }
        },
        SortByParam: {
          name: 'sortBy',
          in: 'query',
          description: 'Field to sort by',
          required: false,
          schema: {
            type: 'string',
            example: 'name'
          }
        },
        SortOrderParam: {
          name: 'sortOrder',
          in: 'query',
          description: 'Sort order (asc or desc)',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc',
            example: 'asc'
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };