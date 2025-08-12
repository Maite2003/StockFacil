const express = require('express');
const {register, login, updateUser, deleteUser} = require('../controllers/auth');
const { 
  userCreateValidation, 
  userLoginValidation,
  userUpdateValidation 
} = require('../validators/user');
const handleValidationErrors = require('../middleware/validation');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.route('/login').post(userLoginValidation, handleValidationErrors, login);
router.route('/register').post(userCreateValidation, handleValidationErrors, register);
router.route('/').patch(authenticationMiddleware, userUpdateValidation, handleValidationErrors, updateUser).delete(authenticationMiddleware, deleteUser);

module.exports = router;