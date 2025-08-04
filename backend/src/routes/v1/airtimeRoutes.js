import express from 'express';
import {
  initiateAirtime,
  checkAirtimeStatus,
  getAirtimeHistory
} from '../../controllers/airtimeController.js';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { airtimeSchema, statusQuerySchema } from '../../utils/validations/utilityValidators.js';
import checkWalletBalance from '../../middlewares/checkWalletBalanceMiddleware.js';
import { authenticateJWT } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/v1/airtime/purchase
 * @desc Purchase airtime
 * @access Protected (API Key with airtime access)
 */
router.post('/purchase',
  requestValidator(airtimeSchema),
  apiKeyAuth,
  checkWalletBalance,
  initiateAirtime
);

/**
 * @route GET /api/v1/airtime/history
 * @desc Get airtime transaction history
 * @access Protected (JWT)
 */
router.get('/history',
  requestValidator(statusQuerySchema, 'query'),
  authenticateJWT,
  getAirtimeHistory
);

/**
 * @route GET /api/v1/airtime/status/:id
 * @desc Check airtime transaction status
 * @access Protected (API Key with airtime access)
 */
router.get('/status/:id',
  apiKeyAuth,
  checkAirtimeStatus
);

export default router; 