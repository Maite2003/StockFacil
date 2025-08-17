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
        html: this.getVerificationEmailTemplate(verificationUrl, userName),
        };

        try {
            const result = this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${user.email}:`, result.messageId);
        } catch (error) {
            console.error('❌ Error sending verification email:', error);  
            throw new Error('Failed to send verification email');
        }
    }

    getVerificationEmailTemplate(verificationUrl, userName) {
        return `<!DOCTYPE html>
                  <html lang="es">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Verificación de Email - StockFacil</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f5f5f5;">
                          <tr>
                              <td align="center" style="padding: 40px 0;">
                                  <table role="presentation" style="width: 600px; max-width: 600px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                      <!-- Header -->
                                      <tr>
                                          <td style="padding: 40px 30px 30px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                                  📦 StockFacil
                                              </h1>
                                              <p style="margin: 10px 0 0 0; font-size: 16px; color: #e8eaff; opacity: 0.9;">
                                                  Sistema de Gestión de Inventarios
                                              </p>
                                          </td>
                                      </tr>
                                      
                                      <!-- Content -->
                                      <tr>
                                          <td style="padding: 40px 30px;">
                                              <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333333; text-align: center;">
                                                  ¡Verifica tu dirección de email!
                                              </h2>
                                              
                                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #666666;">
                                                  Hola <strong style="color: #333333;">${userName}</strong>,
                                              </p>
                                              
                                              <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; color: #666666;">
                                                  Gracias por registrarte en <strong style="color: #667eea;">StockFacil</strong>. Para completar tu registro y acceder a todas las funcionalidades de nuestra plataforma, necesitas verificar tu dirección de email.
                                              </p>
                                              
                                              <div style="text-align: center; margin: 30px 0;">
                                                  <a href="${verificationUrl}" 
                                                    style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                                                      ✓ Verificar Email
                                                  </a>
                                              </div>
                                              
                                              <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                                                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #555555;">
                                                      <strong>🔒 Enlace seguro:</strong>
                                                  </p>
                                                  <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
                                                      Este enlace es válido por <strong>24 horas</strong> y solo puede ser usado una vez por motivos de seguridad.
                                                  </p>
                                              </div>
                                              
                                              <p style="margin: 25px 0 0 0; font-size: 14px; color: #888888; line-height: 1.5;">
                                                  Si no solicitaste esta verificación, puedes ignorar este email. Tu cuenta no será activada hasta que completes la verificación.
                                              </p>
                                          </td>
                                      </tr>
                                      
                                      <!-- Footer -->
                                      <tr>
                                          <td style="padding: 25px 30px; background-color: #f8f9ff; border-radius: 0 0 8px 8px; text-align: center;">
                                              <p style="margin: 0 0 10px 0; font-size: 14px; color: #667eea; font-weight: bold;">
                                                  📦 StockFacil - Gestión Inteligente de Inventarios
                                              </p>
                                              <p style="margin: 0; font-size: 12px; color: #999999;">
                                                  Este es un email automático, por favor no respondas a esta dirección.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </body>
                  </html>`;
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