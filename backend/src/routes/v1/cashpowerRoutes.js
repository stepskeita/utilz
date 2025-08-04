import express from 'express';
import {
  initiateCashpower,
  checkCashpowerStatus,
  getCashpowerHistory,
  checkMeter,
  reprintToken
} from '../../controllers/cashpowerController.js';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { cashpowerSchema, statusQuerySchema } from '../../utils/validations/utilityValidators.js';
import checkWalletBalance from '../../middlewares/checkWalletBalanceMiddleware.js';
import { authenticateJWT } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/v1/cashpower/check-meter
 * @desc Validate meter and calculate costs
 * @access Protected (API Key with cashpower access)
 */
router.post('/check-meter',
  requestValidator(cashpowerSchema),
  apiKeyAuth,
  checkMeter
);

/**
 * @route POST /api/v1/cashpower/purchase
 * @desc Purchase electricity tokens
 * @access Protected (API Key with cashpower access)
 */
router.post('/purchase',
  requestValidator(cashpowerSchema),
  apiKeyAuth,
  checkWalletBalance,
  initiateCashpower
);

/**
 * @route GET /api/v1/cashpower/history
 * @desc Get cashpower transaction history
 * @access Protected (JWT)
 */
router.get('/history',
  requestValidator(statusQuerySchema, 'query'),
  authenticateJWT,
  getCashpowerHistory
);

/**
 * @route GET /api/v1/cashpower/status/:id
 * @desc Check cashpower transaction status
 * @access Protected (API Key with cashpower access)
 */
router.get('/status/:id',
  apiKeyAuth,
  checkCashpowerStatus
);

/**
 * @route POST /api/v1/cashpower/reprint
 * @desc Reprint electricity token
 * @access Protected (API Key with cashpower access)
 */
router.post('/reprint',
  requestValidator(cashpowerSchema),
  apiKeyAuth,
  reprintToken
);

export default router; 