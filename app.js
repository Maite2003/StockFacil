require('dotenv').config();
const prisma = require('./db/prisma');
const express = require('express');
const NotFoundMiddleware = require('./middleware/not-found');
const ErrorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/authentication');

const healthRoute = require('./routes/health');
const authRoute = require('./routes/auth');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const customersRoute = require('./routes/customers');
const suppliersRoute = require('./routes/suppliers');
const variantSupplierRoute = require('./routes/variant-supplier');
const statsRoute = require('./routes/stats');

const { specs, swaggerUi } = require('./swagger');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.'
});

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.json({
    message: 'StockFacil API',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

app.use('/health', healthRoute);
app.use('/api/v1/auth', authLimiter, authRoute);
app.use('/api/v1/products', limiter, authenticationMiddleware, productsRoute);
app.use('/api/v1/categories', limiter, authenticationMiddleware, categoriesRoute);
app.use('/api/v1/customers', limiter, authenticationMiddleware, customersRoute);
app.use('/api/v1/suppliers', limiter, authenticationMiddleware, suppliersRoute);
app.use('/api/v1/variant-suppliers', limiter, authenticationMiddleware, variantSupplierRoute);
app.use('/api/v1/stats', limiter, authenticationMiddleware, statsRoute);

app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    await prisma.$connect();
    app.listen(port, console.log('listening'));
};

start();