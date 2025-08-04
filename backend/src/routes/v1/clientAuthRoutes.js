import express from 'express';
import {
  clientLoginSchema,
  clientChangePasswordSchema,
  clientPasswordResetRequestSchema,
  clientPasswordResetSchema
} from '../../utils/validations/clientValidators.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { authenticateClient } from '../../middlewares/clientAuthMiddleware.js';
import clientAuthController from '../../controllers/clientAuthController.js';

const router = express.Router();

/**
 * @route POST /api/v1/client/auth/login
 * @desc Client login
 * @access Public
 */
router.post('/login',
  requestValidator(clientLoginSchema),
  clientAuthController.login
);

/**
 * @route POST /api/v1/client/auth/change-password
 * @desc Change client password
 * @access Protected (Client)
 */
router.post('/change-password',
  authenticateClient,
  requestValidator(clientChangePasswordSchema),
  clientAuthController.changePassword
);

/**
 * @route POST /api/v1/client/auth/request-password-reset
 * @desc Request password reset
 * @access Public
 */
router.post('/request-password-reset',
  requestValidator(clientPasswordResetRequestSchema),
  clientAuthController.requestPasswordReset
);

/**
 * @route POST /api/v1/client/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password',
  // requestValidator(clientPasswordResetSchema),
  clientAuthController.resetPassword
);

/**
 * @route GET /api/v1/client/auth/profile
 * @desc Get client profile
 * @access Protected (Client)
 */
router.get('/profile',
  authenticateClient,
  clientAuthController.getProfile
);

/**
 * @route POST /api/v1/client/auth/logout
 * @desc Logout client (invalidate token)
 * @access Protected (Client)
 */
router.post('/logout',
  authenticateClient,
  clientAuthController.logout
);

export default router;
