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
import clientController from '../../controllers/clientController.js';

const router = express.Router();

// ==================== AUTHENTICATION ROUTES ====================

/**
 * @route POST /api/v1/client/auth/login
 * @desc Client login
 * @access Public
 */
router.post('/auth/login',
  requestValidator(clientLoginSchema),
  clientAuthController.login
);

/**
 * @route POST /api/v1/client/auth/change-password
 * @desc Change client password
 * @access Protected (Client)
 */
router.post('/auth/change-password',
  authenticateClient,
  requestValidator(clientChangePasswordSchema),
  clientAuthController.changePassword
);

/**
 * @route POST /api/v1/client/auth/request-password-reset
 * @desc Request password reset
 * @access Public
 */
router.post('/auth/request-password-reset',
  requestValidator(clientPasswordResetRequestSchema),
  clientAuthController.requestPasswordReset
);

/**
 * @route POST /api/v1/client/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/auth/reset-password',
  clientAuthController.resetPassword
);

/**
 * @route GET /api/v1/client/auth/profile
 * @desc Get client profile
 * @access Protected (Client)
 */
router.get('/auth/profile',
  authenticateClient,
  clientAuthController.getProfile
);

/**
 * @route POST /api/v1/client/auth/logout
 * @desc Logout client (invalidate token)
 * @access Protected (Client)
 */
router.post('/auth/logout',
  authenticateClient,
  clientAuthController.logout
);

// ==================== PROFILE ROUTES ====================

/**
 * @route GET /api/v1/client/profile
 * @desc Get client profile with wallet and API keys
 * @access Protected (Client)
 */
router.get('/profile',
  authenticateClient,
  clientController.getClientProfile
);

/**
 * @route PUT /api/v1/client/profile
 * @desc Update client profile
 * @access Protected (Client)
 */
router.put('/profile',
  authenticateClient,
  clientController.updateClientProfile
);

/**
 * @route POST /api/v1/client/change-password
 * @desc Change client password
 * @access Protected (Client)
 */
router.post('/change-password',
  authenticateClient,
  clientController.changePassword
);

// ==================== WALLET ROUTES ====================

/**
 * @route GET /api/v1/client/wallet/balance
 * @desc Get client wallet balance
 * @access Protected (Client)
 */
router.get('/wallet/balance',
  authenticateClient,
  clientController.getWalletBalance
);

/**
 * @route GET /api/v1/client/wallet/transactions
 * @desc Get client wallet transactions
 * @access Protected (Client)
 */
router.get('/wallet/transactions',
  authenticateClient,
  clientController.getWalletTransactions
);

/**
 * @route GET /api/v1/client/transactions
 * @desc Get client utility transaction history
 * @access Protected (Client)
 */
router.get('/transactions',
  authenticateClient,
  clientController.getTransactionHistory
);

// ==================== API KEY ROUTES ====================

/**
 * @route GET /api/v1/client/api-keys
 * @desc Get client API keys
 * @access Protected (Client)
 */
router.get('/api-keys',
  authenticateClient,
  clientController.getApiKeys
);

/**
 * @route POST /api/v1/client/api-keys
 * @desc Create new API key
 * @access Protected (Client)
 */
router.post('/api-keys',
  authenticateClient,
  clientController.createApiKey
);

/**
 * @route PUT /api/v1/client/api-keys/:id
 * @desc Update API key
 * @access Protected (Client)
 */
router.put('/api-keys/:id',
  authenticateClient,
  clientController.updateApiKey
);

/**
 * @route DELETE /api/v1/client/api-keys/:id
 * @desc Delete API key
 * @access Protected (Client)
 */
router.delete('/api-keys/:id',
  authenticateClient,
  clientController.deleteApiKey
);

/**
 * @route POST /api/v1/client/api-keys/:id/regenerate
 * @desc Regenerate API key
 * @access Protected (Client)
 */
router.post('/api-keys/:id/regenerate',
  authenticateClient,
  clientController.regenerateApiKey
);

// ==================== STATISTICS ROUTES ====================

/**
 * @route GET /api/v1/client/usage-stats
 * @desc Get client usage statistics
 * @access Protected (Client)
 */
router.get('/usage-stats',
  authenticateClient,
  clientController.getUsageStats
);

export default router;