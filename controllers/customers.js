const CustomerServices = require('../services/customer');
const { StatusCodes } = require('http-status-codes');

const getAllCustomers = async (req, res) => {
    const customers = await CustomerServices.findAll(req.user.id);
    res.status(StatusCodes.OK).json({customers, length: customers.length});
}

const getCustomer = async (req, res) => {
    const customerId = Number(req.params.id);
    const customer = await CustomerServices.findById(req.user.id, customerId);
    res.status(StatusCodes.OK).json({customer});
}

const updateCustomer = async (req, res) => {
    const customerId = Number(req.params.id);
    const customer = await CustomerServices.update(req.user.id, customerId, {...req.body});
    res.status(StatusCodes.OK).json({customer});
}

const createCustomer = async (req, res) => {
    const customer = await CustomerServices.create(req.user.id, {...req.body});
    res.status(StatusCodes.CREATED).json({customer});
}

const deleteCustomer = async (req, res) => {
    const customerId = Number(req.params.id);
    await CustomerServices.delete(req.user.id, customerId);
    res.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer
};