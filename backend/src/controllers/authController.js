import authService from '../services/authService.js';

class AuthController {
  /**
   * Admin user registration
   */
  async register(req, res, next) {
    try {
      const userData = await authService.registerUser(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin user login
   */
  async login(req, res, next) {
    try {
      const authData = await authService.authenticateUser(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: authData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh admin token
   */
  async refreshToken(req, res, next) {
    try {
      const tokens = await authService.refreshUserToken(req.body.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin logout
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

  /**
   * Get current admin profile
   */
  async getProfile(req, res, next) {
    try {
      // User data is already attached by authenticateJWT middleware
      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change admin password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new AuthController();

export const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  changePassword
} = controller;

export default controller;

