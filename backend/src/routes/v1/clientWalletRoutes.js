
import express from 'express';
import {
  createTopUpRequestSchema,
  approveTopUpRequestSchema,
  rejectTopUpRequestSchema
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


// Admin routes for managing top-up requests
/**
 * @route GET /api/v1/client/wallet/admin/top-up-requests
 * @desc Get all top-up requests (Admin)
 * @access Protected (Admin)
 */
router.get('/admin/top-up-requests',
  authenticateJWT,
  clientWalletController.getAllTopUpRequests
);

/**
 * @route GET /api/v1/client/wallet/admin/top-up-requests
 * @desc Get all top-up requests (Admin)
 * @access Protected (Admin)
 */
router.get('/admin/top-up-request/:id',
  authenticateJWT,
  clientWalletController.getAdminTopUpRequest
);

/**
 * @route POST /api/v1/client/wallet/admin/top-up-request/:id/approve
 * @desc Approve top-up request (Admin)
 * @access Protected (Admin)
 */
router.post('/admin/top-up-request/:id/approve',
  authenticateJWT,
  requestValidator(approveTopUpRequestSchema),
  clientWalletController.approveTopUpRequest
);

/**
 * @route POST /api/v1/client/wallet/admin/top-up-request/:id/reject
 * @desc Reject top-up request (Admin)
 * @access Protected (Admin)
 */
router.post('/admin/top-up-request/:id/reject',
  authenticateJWT,
  requestValidator(rejectTopUpRequestSchema),
  clientWalletController.rejectTopUpRequest
);

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
