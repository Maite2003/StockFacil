
const { StatusCodes } = require('http-status-codes');
const StatsServices = require('../services/stats');

const getInventoryStats = async (req, res) => {
    const response = await StatsServices.getInventoryStats(req.user.id);

    res.status(StatusCodes.OK).json(response);
}

const getAgendaStats = async (req, res) => {
    const response = await StatsServices.getAgendaStats(req.user.id);

    res.status(StatusCodes.OK).json(response);
}

module.exports = {
    getInventoryStats,
    getAgendaStats
};