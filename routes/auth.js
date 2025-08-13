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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user and receive access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *           example:
 *             email: "john.doe@example.com"
 *             password: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               user:
 *                 id: 1
 *                 email: "john.doe@example.com"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 business_name: "Doe's Business"
 *                 is_active: true
 *                 email_verified: false
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Invalid email or password"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "User not found"
 */

router.route('/login').post(userLoginValidation, handleValidationErrors, login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securepassword123"
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               business_name:
 *                 type: string
 *                 nullable: true
 *                 example: "Doe's Business"
 *           example:
 *             email: "john.doe@example.com"
 *             password: "securepassword123"
 *             first_name: "John"
 *             last_name: "Doe"
 *             business_name: "Doe's Business"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               user:
 *                 id: 1
 *                 email: "john.doe@example.com"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 business_name: "Doe's Business"
 *                 is_active: true
 *                 email_verified: false
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T10:30:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   msg: "Email is required"
 *               email_exists:
 *                 summary: Email already exists
 *                 value:
 *                   msg: "Email already registered"
 */

router.route('/register').post(userCreateValidation, handleValidationErrors, register);

/**
 * @swagger
 * /auth/profile:
 *   delete:
 *     tags: [Authentication]
 *     summary: Delete user account
 *     description: Delete current authenticated user's account (soft delete)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User account deleted successfully (no content)
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Authentication Invalid"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "User with id 3 not found"
 *
 *   patch:
 *     tags: [Authentication]
 *     summary: Update user profile
 *     description: Update current authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               business_name:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated Business Name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *           example:
 *             first_name: "John"
 *             last_name: "Doe Updated"
 *             business_name: "My Updated Business"
 *             email: "john.updated@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               user:
 *                 id: 1
 *                 email: "john.updated@example.com"
 *                 first_name: "John"
 *                 last_name: "Doe Updated"
 *                 business_name: "My Updated Business"
 *                 is_active: true
 *                 email_verified: false
 *                 created_at: "2025-08-13T10:30:00.000Z"
 *                 updated_at: "2025-08-13T15:45:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Invalid email format"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Authentication Invalid"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "User with id 3 not found"
 */

router.route('/profile').patch(authenticationMiddleware, userUpdateValidation, handleValidationErrors, updateUser).delete(authenticationMiddleware, deleteUser);

module.exports = router;