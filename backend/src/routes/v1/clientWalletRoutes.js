
import express from 'express';
import {
  createTopUpRequestSchema
} from '../../utils/validations/clientValidators.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { authenticateClient } from '../../middlewares/clientAuthMiddleware.js';
import { authenticateJWT } from '../../middlewares/authMiddleware.js';
import clientWalletController from '../../controllers/clientWalletController.js';

const router = express.Router();

/**
 * @route GET /api/v1/client/wallet/balance
 * @desc Get client wallet balance
 * @access Protected (Client)
 */
router.get('/balance',
  authenticateClient,
  clientWalletController.getWalletBalance
);

/**
 * @route GET /api/v1/client/wallet/transactions
 * @desc Get client transaction history
 * @access Protected (Client)
 */
router.get('/transactions',
  authenticateClient,
  clientWalletController.getWalletTransactions
);

/**
 * @route POST /api/v1/client/wallet/top-up-request
 * @desc Create new top-up request
 * @access Protected (Client)
 */
router.post('/top-up-request',
  authenticateClient,
  requestValidator(createTopUpRequestSchema),
  clientWalletController.createTopUpRequest
);

/**
 * @route GET /api/v1/client/wallet/top-up-requests
 * @desc Get client's top-up requests
 * @access Protected (Client)
 */
router.get('/top-up-requests',
  authenticateClient,
  clientWalletController.getTopUpRequests
);

/**
 * @route GET /api/v1/client/wallet/top-up-request/:id
 * @desc Get specific top-up request details
 * @access Protected (Client)
 */
router.get('/top-up-request/:id',
  authenticateClient,
  clientWalletController.getTopUpRequest
);


/**
 * @route DELETE /api/v1/client/wallet/top-up-request/:requestId
 * @desc Delete a pending top-up request (Client)
 * @access Protected (Client)
 */
router.delete('/top-up-request/:requestId',
  authenticateClient,
  clientWalletController.deleteTopUpRequest
);


// Note: Admin routes for managing top-up requests are handled in adminRoutes.js
// Admin endpoints: /api/v1/admin/top-up-requests/*

/**
 * @route GET /api/v1/client/wallet/admin/client/:clientId/transactions
 * @desc Get client transaction history (Admin)
 * @access Protected (Admin)
 */
router.get('/admin/client/:clientId/transactions',
  authenticateJWT,
  clientWalletController.getWalletTransactions
);

/**
 * @route GET /api/v1/client/wallet/admin/client/:clientId/balance
 * @desc Get client wallet balance (Admin)
 * @access Protected (Admin)
 */
router.get('/admin/client/:clientId/balance',
  authenticateJWT,
  clientWalletController.getWalletBalance
);

export default router;
