const { StatusCodes } = require('http-status-codes');
const UserServices = require('../services/user');

const register = async (req, res) => {
    const data = await UserServices.register({...req.body});
    res.status(StatusCodes.CREATED).json(data);
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const data = await UserServices.login(email, password);
    res.status(StatusCodes.OK).json(data);
}

const updateUser = async (req, res) => {
    const data = await UserServices.update(req.user.id, {...req.body});
    res.status(StatusCodes.OK).json(data);
}

const deleteUser = async (req, res) => {
    await UserServices.delete(req.user.id);
    res.status(StatusCodes.NO_CONTENT).send();
}

const getProfile = async (req, res) => {
    const user = await UserServices.findById(req.user.id);
    res.status(StatusCodes.OK).json({user});
}


module.exports = {
    register,
    login,
    updateUser,
    deleteUser,
    getProfile
}