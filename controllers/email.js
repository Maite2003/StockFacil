const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const EmailServices = require("../services/emailServices");

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    await EmailServices.verifyEmail(token);
    res.status(StatusCodes.NO_CONTENT).send();
};



const sendVerification = async (req, res) => {
    await EmailServices.sendVerificationEmail(req.user);

    res.status(StatusCodes.NO_CONTENT).send();;
};

const verifyEmailStatus = async (req, res) => {
    res.status(StatusCodes.OK).json({
        email: req.user.email,
        email_verified: req.user.email_verified
    });
}


module.exports = {
    verifyEmail,
    sendVerification,
    verifyEmailStatus
};