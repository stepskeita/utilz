import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import createError from 'http-errors';
import Client from '../models/Client.js';
import emailService from './emailService.js';
import {
  clientPasswordResetTemplate,
  clientPasswordChangeConfirmationTemplate
} from '../utils/emailTemplates/clientEmailTemplates.js';
import { Op } from 'sequelize';

class ClientAuthService {
  /**
   * Client login
   * @param {string} email - Client email
   * @param {string} password - Client password
   * @returns {Promise<Object>} Login result with token
   */
  async login(email, password) {
    try {
      // Find client by email
      const client = await Client.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!client) {
        throw createError(401, 'Invalid email or password');
      }

      // Check if client is active
      if (!client.isActive) {
        throw createError(401, 'Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid) {
        throw createError(401, 'Invalid email or password');
      }

      // Update last login
      await client.update({ lastLoginAt: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: client.id,
          email: client.email,
          type: 'client'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      return {
        success: true,
        message: 'Login successful',
        token,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          contactPerson: client.contactPerson,
          plan: client.plan,
          lastLoginAt: client.lastLoginAt
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change client password
   * @param {string} clientId - Client ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change result
   */
  async changePassword(clientId, currentPassword, newPassword, ipAddress) {
    try {
      const client = await Client.findByPk(clientId);

      if (!client) {
        throw createError(404, 'Client not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, client.password);
      if (!isCurrentPasswordValid) {
        throw createError(400, 'Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await client.update({ password: hashedPassword });

      // Send notification email using template
      const emailTemplate = clientPasswordChangeConfirmationTemplate(
        client.name,
        new Date().toLocaleString(),
        ipAddress
      );
      await emailService.sendEmail(
        client.email,
        emailTemplate.subject,
        emailTemplate.html,
        emailTemplate.text
      );

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - Client email
   * @returns {Promise<Object>} Reset request result
   */
  async requestPasswordReset(email) {
    try {
      const client = await Client.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!client) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token
      await client.update({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      });

      // Create reset link and send email using template
      const resetLink = `${process.env.CLIENT_PORTAL_URL}/reset-password?token=${resetToken}`;
      const emailTemplate = clientPasswordResetTemplate(client.name, resetLink, resetToken);
      await emailService.sendEmail(
        client.email,
        emailTemplate.subject,
        emailTemplate.html,
        emailTemplate.text
      );

      return {
        success: true,
        message: 'Password reset link has been sent to your email'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(token, newPassword) {
    try {

      console.log(token);
      const client = await Client.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!client) {
        throw createError(400, 'Invalid or expired reset token');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset fields
      await client.update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      });

      // Send confirmation email using template
      const emailTemplate = clientPasswordChangeConfirmationTemplate(
        client.name,
        new Date().toLocaleString(),
        'Password Reset'
      );
      await emailService.sendEmail(
        client.email,
        emailTemplate.subject,
        emailTemplate.html,
        emailTemplate.text
      );

      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify JWT token and get client
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Client data
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== 'client') {
        throw createError(401, 'Invalid token type');
      }

      const client = await Client.findByPk(decoded.id);

      if (!client || !client.isActive) {
        throw createError(401, 'Client not found or inactive');
      }

      return {
        id: client.id,
        email: client.email,
        name: client.name,
        contactPerson: client.contactPerson,
        plan: client.plan
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createError(401, 'Token expired');
      }
      throw createError(401, 'Invalid token');
    }
  }
}

export default new ClientAuthService();
