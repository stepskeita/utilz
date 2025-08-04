import express from 'express';
import { authenticateJWT, authorizeAdmin } from '../../middlewares/authMiddleware.js';
import adminController from '../../controllers/adminController.js';
import authController from '../../controllers/authController.js';
import requestValidator from '../../middlewares/requestValidator.js';
import {
  createClientSchema,
  updateClientSchema,
  createApiKeySchema,
  updateApiKeySchema
} from '../../utils/validations/clientValidators.js';

const router = express.Router();

// ==================== AUTHENTICATION ROUTES (PUBLIC) ====================

/**
 * @route POST /api/v1/admin/auth/login
 * @desc Admin login
 * @access Public
 */
router.post('/auth/login', authController.login);

/**
 * @route POST /api/v1/admin/auth/register
 * @desc Admin registration
 * @access Public
 */
router.post('/auth/register', authController.register);

/**
 * @route POST /api/v1/admin/auth/refresh-token
 * @desc Refresh admin token
 * @access Public
 */
router.post('/auth/refresh-token', authController.refreshToken);

// ==================== PROTECTED ROUTES ====================

// All routes below this require admin privileges
router.use(authenticateJWT, authorizeAdmin);

/**
 * @route GET /api/v1/admin/auth/profile
 * @desc Get admin profile
 * @access Protected (Admin)
 */
router.get('/auth/profile', authController.getProfile);

/**
 * @route POST /api/v1/admin/auth/logout
 * @desc Admin logout
 * @access Protected (Admin)
 */
router.post('/auth/logout', authController.logout);

/**
 * @route POST /api/v1/admin/auth/change-password
 * @desc Change admin password
 * @access Protected (Admin)
 */
router.post('/auth/change-password', authController.changePassword);

// ==================== CLIENT MANAGEMENT ROUTES ====================

/**
 * @route GET /api/v1/admin/clients
 * @desc Get all clients
 * @access Protected (Admin)
 */
router.get('/clients', adminController.getAllClients);

/**
 * @route GET /api/v1/admin/clients/:id
 * @desc Get client by ID
 * @access Protected (Admin)
 */
router.get('/clients/:id', adminController.getClient);

/**
 * @route POST /api/v1/admin/clients
 * @desc Create new client
 * @access Protected (Admin)
 */
router.post('/clients',
  requestValidator(createClientSchema),
  adminController.createClient
);

/**
 * @route PUT /api/v1/admin/clients/:id
 * @desc Update client
 * @access Protected (Admin)
 */
router.put('/clients/:id',
  requestValidator(updateClientSchema),
  adminController.updateClient
);

/**
 * @route DELETE /api/v1/admin/clients/:id
 * @desc Delete client
 * @access Protected (Admin)
 */
router.delete('/clients/:id', adminController.deleteClient);

// ==================== WALLET MANAGEMENT ROUTES ====================

/**
 * @route PUT /api/v1/admin/clients/:clientId/wallet
 * @desc Update client wallet balance
 * @access Protected (Admin)
 */
router.put('/clients/:clientId/wallet', adminController.updateClientWallet);

// ==================== TOP-UP REQUEST MANAGEMENT ROUTES ====================

/**
 * @route GET /api/v1/admin/top-up-requests
 * @desc Get all top-up requests
 * @access Protected (Admin)
 */
router.get('/top-up-requests', adminController.getAllTopUpRequests);

/**
 * @route GET /api/v1/admin/top-up-requests/:id
 * @desc Get specific top-up request
 * @access Protected (Admin)
 */
router.get('/top-up-requests/:id', adminController.getTopUpRequest);

/**
 * @route POST /api/v1/admin/top-up-requests/:id/approve
 * @desc Approve top-up request
 * @access Protected (Admin)
 */
router.post('/top-up-requests/:id/approve', adminController.approveTopUpRequest);

/**
 * @route POST /api/v1/admin/top-up-requests/:id/reject
 * @desc Reject top-up request
 * @access Protected (Admin)
 */
router.post('/top-up-requests/:id/reject', adminController.rejectTopUpRequest);

/**
 * @route GET /api/v1/admin/top-up-requests/:requestId/receipt
 * @desc Download receipt
 * @access Protected (Admin)
 */
router.get('/top-up-requests/:requestId/receipt', adminController.downloadReceipt);

// ==================== API KEY MANAGEMENT ROUTES ====================

/**
 * @route GET /api/v1/admin/api-keys
 * @desc Get all API keys
 * @access Protected (Admin)
 */
router.get('/api-keys', adminController.getAllApiKeys);

/**
 * @route GET /api/v1/admin/api-keys/:id
 * @desc Get API key by ID
 * @access Protected (Admin)
 */
router.get('/api-keys/:id', adminController.getApiKeyById);

/**
 * @route POST /api/v1/admin/clients/:clientId/api-keys
 * @desc Create API key for client
 * @access Protected (Admin)
 */
router.post('/clients/:clientId/api-keys',
  requestValidator(createApiKeySchema),
  adminController.createApiKey
);

/**
 * @route PUT /api/v1/admin/api-keys/:id
 * @desc Update API key
 * @access Protected (Admin)
 */
router.put('/api-keys/:id',
  requestValidator(updateApiKeySchema),
  adminController.updateApiKey
);

/**
 * @route DELETE /api/v1/admin/api-keys/:id
 * @desc Delete API key
 * @access Protected (Admin)
 */
router.delete('/api-keys/:id', adminController.deleteApiKey);

/**
 * @route POST /api/v1/admin/api-keys/:id/regenerate
 * @desc Regenerate API key
 * @access Protected (Admin)
 */
router.post('/api-keys/:id/regenerate', adminController.regenerateApiKey);

// ==================== ANALYTICS & REPORTING ROUTES ====================

/**
 * @route GET /api/v1/admin/analytics
 * @desc Get system analytics
 * @access Protected (Admin)
 */
router.get('/analytics', adminController.getSystemAnalytics);

/**
 * @route GET /api/v1/admin/transactions
 * @desc Get transaction history for admin
 * @access Protected (Admin)
 */
router.get('/transactions', adminController.getTransactionHistory);

// ==================== BALANCE MONITORING ROUTES ====================

/**
 * @route POST /api/v1/admin/balance/check
 * @desc Manually trigger balance check
 * @access Protected (Admin)
 */
router.post('/balance/check', adminController.checkBalance);

/**
 * @route GET /api/v1/admin/balance/status
 * @desc Get current balance status
 * @access Protected (Admin)
 */
router.get('/balance/status', adminController.getBalanceStatus);

/**
 * @route POST /api/v1/admin/balance/test-alert
 * @desc Send test balance alert email
 * @access Protected (Admin)
 */
router.post('/balance/test-alert', adminController.sendTestAlert);

/**
 * @route GET /api/v1/admin/balance/monitoring
 * @desc Get monitoring service status
 * @access Protected (Admin)
 */
router.get('/balance/monitoring', adminController.getMonitoringStatus);

export default router; 