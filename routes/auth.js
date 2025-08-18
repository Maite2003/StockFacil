const express = require('express');
const {register, login, updateUser, deleteUser, getProfile} = require('../controllers/auth');
const { 
  userCreateValidation, 
  userLoginValidation,
  userUpdateValidation 
} = require('../validators/user');
const handleValidationErrors = require('../middleware/validation');
const authenticationMiddleware = require('../middleware/authentication');
const { verifyEmail, verifyEmailStatus, sendVerification } = require('../controllers/email');

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
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a specific user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
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

router.route('/profile').patch(authenticationMiddleware, userUpdateValidation, handleValidationErrors, updateUser).delete(authenticationMiddleware, deleteUser).get(authenticationMiddleware, getProfile);

/**
 * @swagger
 * /auth/send-verification:
 *   post:
 *     summary: Send email verification
 *     description: |
 *       Sends a verification email to the authenticated user's email address. 
 *       This endpoint generates a JWT token with 24-hour expiration and sends 
 *       a professional HTML email containing a verification link. The email is 
 *       sent using Nodemailer with Gmail OAuth2 for high deliverability. 
 *       If the user's email is already verified, returns a 409 error. 
 *       The system handles email service errors gracefully and will return 
 *       success even if the email service is misconfigured (logging errors internally).
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Verification email sent successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error or email service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/send-verification').post(authenticationMiddleware, sendVerification);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify email with token
 *     description: |
 *       Verifies a user's email address using the JWT token received via email. 
 *       This is a public endpoint that doesn't require authentication. 
 *       The token is validated for authenticity, expiration, and purpose. 
 *       Upon successful verification, the user's email_verified field is set to true 
 *       and the verification token is cleared from the database for security. 
 *       The token is single-use and expires after 24 hours. 
 *       Returns the updated user object on success.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token received in verification email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInB1cnBvc2UiOiJlbWFpbF92ZXJpZmljYXRpb24iLCJpYXQiOjE2OTI4NzM2MDAsImV4cCI6MTY5Mjk2MDAwMH0.example_signature"
 *     responses:
 *       204:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/verify-email/:token').get(verifyEmail);

/**
 * @swagger
 * /auth/verification-status:
 *   get:
 *     summary: Get email verification status
 *     description: |
 *       Returns the current email verification status for the authenticated user. 
 *       This endpoint is useful for frontend applications to determine whether 
 *       to display email verification prompts or update the UI based on 
 *       verification status. The response includes the verification status 
 *       (boolean) and the user's email address. The status reflects the 
 *       real-time state from the database.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The user's email address
 *                 email_verified:
 *                   type: boolean
 *                   description: Whether the user's email is verified
 *             example:
 *               email: "john.doe@example.com"
 *               email_verified: true
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.route('/verification-status').get(authenticationMiddleware, verifyEmailStatus);

module.exports = router;