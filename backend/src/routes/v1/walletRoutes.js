import express from 'express';
import {
  getClientWallet,
  addFunds,
  getTransactionHistory,
  updateWalletSettings,
  createWallet,
  getClientWalletTransactionHistory
} from '../../controllers/walletController.js';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import { authenticateJWT, authorizeAdmin } from '../../middlewares/authMiddleware.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { addFundsSchema, createWalletSchema } from '../../utils/validations/walletValidators.js';
import { authenticateClient } from '../../middlewares/clientAuthMiddleware.js';

const router = express.Router();

// Routes for clients to manage their own wallet

router.get('/client/:clientId/transactions', authenticateClient, getClientWalletTransactionHistory);

router.get('/me', apiKeyAuth, getClientWallet);
router.get('/me/transactions', apiKeyAuth, getTransactionHistory);
router.put('/me/settings', apiKeyAuth, updateWalletSettings);

// Admin routes for managing any wallet
router.use('/admin', authenticateJWT, authorizeAdmin);
router.post('/admin/create', requestValidator(createWalletSchema), createWallet);
router.post('/admin/addfunds', requestValidator(addFundsSchema
), addFunds);
router.get('/admin/client/:clientId', getClientWallet);
router.get('/admin/client/:clientId/transactions', getTransactionHistory);
router.put('/admin/client/:clientId/settings', updateWalletSettings);

export default router;