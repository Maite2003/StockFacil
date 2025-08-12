require('dotenv').config();
const prisma = require('./db/prisma');
const express = require('express');
const NotFoundMiddleware = require('./middleware/not-found');
const ErrorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/authentication');

const authRoute = require('./routes/auth');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const productVariantsRoute = require('./routes/product-variants');
const customersRoute = require('./routes/customers');
const suppliersRoute = require('./routes/suppliers');
const variantSupplierRoute = require('./routes/variant-supplier');

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', authenticationMiddleware, productsRoute);
app.use('/api/v1/product/:productId/variants', authenticationMiddleware, productVariantsRoute);
app.use('/api/v1/categories', authenticationMiddleware, categoriesRoute);
app.use('/api/v1/customers', authenticationMiddleware, customersRoute);
app.use('/api/v1/suppliers', authenticationMiddleware, suppliersRoute);
app.use('/api/v1/variant-suppliers', authenticationMiddleware, variantSupplierRoute);

app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const port = process.env.PORT;

const start = async () => {
    await prisma.$connect();
    app.listen(port, console.log('listening'));
};

start();