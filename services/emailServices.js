require('dotenv').config();
const nodemailer = require('nodemailer');
const { BadRequestError, ConflictError } = require('../errors');
const prisma = require('../db/prisma');
const jwt = require('jsonwebtoken');

class EmailServices {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }


    initializeTransporter() {
        try {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                },
            });

            console.log('✅ Email transporter initialized');
        } catch (error) {
            throw new Error('❌ Error initializing email transporter:', error);
        }
    }

    async generateToken(user) {
        const verificationToken = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                purpose: 'email_verification'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);
        await prisma.user.update({
            where: {id:user.id},
            data: {email_verification_token: verificationToken,
            email_verification_expires: expirationDate}
        });

        return verificationToken;
    }

    async sendVerificationEmail(user) {
        if (!this.transporter) {
        throw new Error('Email transporter not initialized');
        }

        if (user.email_verified) {
            throw new ConflictError('Email is already verified');
        }
        
        const verificationToken = await this.generateToken(user);
    
        const userName = `${user.first_name} ${user.last_name}`;

        const verificationUrl = `${process.env.API_URL || `http://localhost:${process.env.PORT}`}/auth/verify-email/${verificationToken}`;
        
        const mailOptions = {
        from: {
            name: 'StockFacil',
            address: process.env.GMAIL_USER
        },
        to: user.email,
        subject: '📧 Verify Your Email - StockFacil',
        html: this.getVerificationEmailTemplate(verificationUrl, userName, user.email),
        };

        try {
            const result = this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${user.email}:`, result.messageId);
        } catch (error) {
            console.error('❌ Error sending verification email:', error);  
            throw new Error('Failed to send verification email');
        }
    }

    getVerificationEmailTemplate(verificationUrl, userName, userEmail) {
        return `



        
        
        Verify Your Email - StockFacil\n\n
        
            
                📦 StockFacil\n
                Inventory Management Made Easy\n\n
            
            
            
                Welcome to StockFacil!\n
                
                
                    Thank you for registering with StockFacil. You're just one step away from taking complete control of your inventory management.\n\n
                
                
                
                    Account Details:\n
                    ${userName ? `Name: ${userName}` : ''}\n
                    Email: ${userEmail}\n\n
                
                
                
                    
                        To activate your account and start managing your inventory, please verify your email address:\n
                    
                    
                    
                        ✉️ Verify Email Address\n\n
                    
                
                
                
                    ⏰ Important: This verification link expires in 24 hours.
                    After expiration, you'll need to request a new verification email.\n
                
                
                
                    🔒 Security Note: This email was sent because someone registered an account with this email address. If this wasn't you, please ignore this email.\n
                
                
                
                
                
                    Having trouble with the button? Copy and paste this link into your browser:
                    ${verificationUrl}\n\n
                
            
            
            
                
                    The StockFacil Team\n
                    
                        This is an automated message. Please do not reply to this email.\n
                    
                    
                        © 2025 StockFacil. All rights reserved.
                    
                
            
        

        `;
    }

  async verifyConnection() {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Gmail OAuth2 connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Gmail OAuth2 connection failed:', error.message);
      return false;
    }
  }

  async verifyEmail(token) {
    console.log(token);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (error) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    if (decoded.purpose !== 'email_verification') {
      throw new BadRequestError('Invalid token purpose');
    }

    const user = await prisma.user.findUnique({where:{id:decoded.userId}});

    if (user.email_verified) {
        throw new BadRequestError('Email already verified');
    }

    // Verify token is the same as the one saved
    if (user.email_verification_token !== token) {
      throw new BadRequestError('Invalid verification token');
    }

    // Check expiration
    if (user.email_verification_expires && new Date() > user.email_verification_expires) {
      throw new BadRequestError('Verification token has expired');
    }
    
    await prisma.user.update({
        where: {id: user.id},
        data: {
            email_verified: true,
            email_verification_token: null,
            email_verification_expires: null
        }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    throw new Error('Server error during email verification');
  }
}


module.exports = new EmailServices();