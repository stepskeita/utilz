import express from 'express';
import {
  initiateAirtime,
  checkAirtimeStatus,
  getAirtimeHistory,
  initiateCashpower,
  checkCashpowerStatus,
  getCashpowerHistory,
  reprintCashpowerToken
} from '../../controllers/utilityController.js';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { airtimeSchema, cashpowerSchema, statusQuerySchema } from '../../utils/validations/utilityValidators.js';
import checkWalletBalance from '../../middlewares/checkWalletBalanceMiddleware.js';
import { authenticateJWT } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Airtime routes
router.post('/airtime', requestValidator(airtimeSchema), apiKeyAuth, checkWalletBalance, initiateAirtime);
router.get('/airtime/history', requestValidator(statusQuerySchema, 'query'), authenticateJWT, getAirtimeHistory);

// Cashpower routes
router.post('/cashpower', requestValidator(cashpowerSchema), apiKeyAuth, checkWalletBalance, initiateCashpower);
router.get('/cashpower/history', requestValidator(statusQuerySchema, 'query'), authenticateJWT, getCashpowerHistory);
router.post('/cashpower/reprint', requestValidator(cashpowerSchema), apiKeyAuth, reprintCashpowerToken);

export default router;