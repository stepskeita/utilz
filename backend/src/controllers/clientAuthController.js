import clientAuthService from '../services/clientAuthService.js';
import createError from 'http-errors';

class ClientAuthController {
  /**
   * Client login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await clientAuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          token: result.token,
          client: result.client
        }
      });
    } catch (error) {
      console.log("Login error:", error);
      next(error);
    }
  }

  /**
   * Change client password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const clientId = req.client.id;

      const result = await clientAuthService.changePassword(clientId, currentPassword, newPassword, req.ip || req.connection.remoteAddress);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      const result = await clientAuthService.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(req, res, next) {
    try {
      console.log(req.body);
      const { token, newPassword } = req.body;

      const result = await clientAuthService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current client profile
   */
  async getProfile(req, res, next) {
    try {
      // Client data is already attached by authenticateClient middleware
      res.status(200).json({
        success: true,
        data: {
          client: req.client
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout (client-side token invalidation)
   */
  async logout(req, res, next) {
    try {
      // Since we're using stateless JWT, logout is handled client-side
      // But we can log the logout action for audit purposes
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ClientAuthController();

export const {
  login,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getProfile,
  logout
} = controller;

export default controller;
