# 📦 StockFacil - Inventory Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=render)](https://stockfacil.onrender.com)
[![API Documentation](https://img.shields.io/badge/API%20Docs-Swagger-green?style=for-the-badge&logo=swagger)](https://stockfacil.onrender.com/api-docs)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **A comprehensive web application for inventory, customer, and supplier management built with modern technologies and best practices.**

## 🌟 Overview

StockFacil is a full-featured inventory management system designed for small to medium businesses. It provides complete control over stock, pricing, commercial relationships, and product variants with a modern, secure, and scalable architecture.

### ✨ Key Features

- 🏢 **Multi-tenant Architecture** - Complete data isolation per user
- 📊 **Advanced Inventory Management** - Products with variants, stock control, and alerts
- 👥 **Customer & Supplier Management** - Complete contact database
- 🔐 **Secure Authentication** - JWT with email verification system
- 📧 **Email Integration** - Nodemailer with Gmail OAuth2
- 📈 **Real-time Statistics** - Inventory and business insights
- 🔍 **Advanced Search & Pagination** - Efficient data handling
- 📚 **Complete API Documentation** - Swagger/OpenAPI 3.0
- 🚀 **Production Ready** - Deployed with security best practices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database toolkit and query builder
- **JWT** - Authentication and authorization
- **Nodemailer** - Email service with OAuth2
- **Swagger** - API documentation

### Security & Performance
- **Helmet** - Security headers
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing
- **Input Validation** - express-validator
- **Password Hashing** - bcryptjs
- **SQL Injection Protection** - Parameterized queries

### Deployment & DevOps
- **Render** - Cloud platform
- **Environment-based Configuration** - Development/Production
- **Health Check Endpoints** - System monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v13+)
- Gmail account for email service

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maite2003/stockfacil.git
   cd stockfacil
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/stockfacil"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Email (Gmail OAuth2)
   GMAIL_USER="your-email@gmail.com"
   GMAIL_CLIENT_ID="your-google-oauth-client-id"
   GMAIL_CLIENT_SECRET="your-google-oauth-client-secret"
   GMAIL_REFRESH_TOKEN="your-google-oauth-refresh-token"
   
   # Frontend URL
   API_URL="http://localhost:3000"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Visit the API**
   - API Base URL: `http://localhost:3000`
   - Documentation: `http://localhost:3000/api-docs`

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `PATCH /auth/profile` - Update user profile
- `DELETE /auth/profile` - Delete user account
- `POST /auth/send-verification` - Send email verification
- `GET /auth/verify-email/:token` - Verify email address
- `GET /auth/verification-status` - Check verification status

### Products & Inventory
- `GET /products` - List products (with pagination, search, sort)
- `POST /products` - Create product
- `GET /products/:id` - Get product details
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Product Variants
- `GET /products/:productId/variants` - List variants
- `POST /products/:productId/variants` - Create variant
- `GET /products/:productId/variants/:id` - Get variant
- `PATCH /products/:productId/variants/:id` - Update variant
- `DELETE /products/:productId/variants/:id` - Delete variant

### Customers & Suppliers
- `GET /customers` - List customers (with pagination, search, sort)
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer details
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

*Similar endpoints available for `/suppliers`*

### Categories
- `GET /categories` - List categories
- `POST /categories` - Create category
- `GET /categories/:id` - Get category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Variant-Supplier Relationships
- `GET /suppliers/:supplierId/variants` - Get supplier's variants
- `POST /variant-suppliers` - Create relationship
- `GET /variant-suppliers/:id` - Get relationship
- `PATCH /variant-suppliers/:id` - Update relationship
- `DELETE /variant-suppliers/:id` - Delete relationship

### Statistics & Utilities
- `GET /stats/inventory` - Inventory statistics
- `GET /stats/agenda` - Customer/supplier statistics
- `GET /health` - Health check
- `GET /` - API information

## 🏗️ Architecture

### Multi-tenant Design
Every table includes `user_id` as a foreign key, ensuring complete data isolation between users:

```sql
-- Example: All queries automatically filter by user
SELECT * FROM products 
WHERE user_id = :current_user_id AND id = :product_id;
```

### Database Schema
- **Users** - Authentication and user profiles
- **Products** - Product catalog with selling prices
- **Product_Variants** - Stock control and variant management
- **Categories** - Hierarchical product organization
- **Customers/Suppliers** - Contact management
- **Variant_Suppliers** - Purchase price and supplier relationships

### Key Design Decisions

1. **Stock Control in Variants Only**
   - Consistent stock management across simple and complex products
   - Default variants for simple products
   - Independent stock per variant

2. **Separate Customer/Supplier Tables**
   - Clear role separation
   - Future scalability for role-specific features

3. **JWT Authentication with Email Verification**
   - Secure token-based authentication
   - Professional email templates with OAuth2

## 📊 Features Deep Dive

### Advanced Pagination System
All list endpoints support:
- **Pagination**: `?page=1&limit=10`
- **Search**: `?search=term` (searches across relevant fields)
- **Sorting**: `?sortBy=name&sortOrder=asc`

Response format:
```json
{
  "products": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextPage": 2,
    "previousPage": null,
    "startItem": 1,
    "endItem": 10
  }
}
```

### Email Verification System
- Professional HTML email templates
- JWT tokens with 24-hour expiration
- Gmail OAuth2 integration for reliable delivery
- Graceful error handling
- Single-use verification tokens

### Product Variant System
- **Simple Products**: Automatic default variant creation
- **Complex Products**: Multiple variants with independent stock
- **Unified API**: Same interface regardless of complexity
- **Stock Alerts**: Configurable minimum stock notifications

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run db:migrate  # Run database migrations
npm run db:reset    # Reset database (development only)
```

### Database Commands
```bash
# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

## 🚀 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secure-production-jwt-secret"
GMAIL_USER="your-business-email@gmail.com"
GMAIL_CLIENT_ID="your-google-oauth-client-id"
GMAIL_CLIENT_SECRET="your-google-oauth-client-secret"
GMAIL_REFRESH_TOKEN="your-google-oauth-refresh-token"
API_URL="https://your-frontend-domain.com"
```

### Security Features (Production)
- **Helmet** - Security headers (XSS, clickjacking protection)
- **Rate Limiting** - 5 req/15min for auth, 100 req/15min for API
- **CORS** - Properly configured for production domains
- **Input Sanitization** - Protection against malicious input
- **Environment-based Configuration** - Different settings per environment

## 📖 API Documentation

Complete API documentation is available at:
- **Production**: [https://stockfacil.onrender.com/api-docs](https://stockfacil.onrender.com/api-docs)
- **Local**: `http://localhost:3000/api-docs`

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Interactive testing interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Maite Nigro**
- GitHub: [@Maite2003](https://github.com/Maite2003)
- LinkedIn: [maite-nigro](https://linkedin.com/maite-nigro)
- Email: maitenigro03@gmail.com

## 🙏 Acknowledgments

- Built with modern Node.js and Express 5
- Database design inspired by multi-tenant SaaS best practices
- Email templates designed for maximum compatibility
- Security implementation following OWASP guidelines

---

**⭐ If you found this project helpful, please give it a star!**
