import ClientWallet from '../models/ClientWallet.js';
import { hasSufficientBalance } from '../services/walletService.js';
import emailService from '../services/emailService.js';
import createError from 'http-errors';

/**
 * Middleware to check if client has sufficient wallet balance for a transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const checkWalletBalance = async (req, res, next) => {
  try {
    // Skip if this is not a utility request
    if (!req.body.amount) {
      return next();
    }

    const clientId = req.client?.id; // From apiKeyAuth middleware
    const amount = parseFloat(req.body.amount);

    if (!clientId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const wallet = await ClientWallet.findOne({
      where: { clientId }
    });

    if (!wallet || wallet.status !== 'active') {
      const requestInfo = {
        apiKeyName: req.apiKey?.name,
        endpoint: req.originalUrl,
        method: req.method,
        ipAddress: req.ip || req.connection.remoteAddress
      };

      emailService.sendClientErrorNotification(
        req.client,
        'ACCOUNT_INACTIVE',
        `Wallet status is ${wallet?.status || 'not found'}`,
        requestInfo
      );

      return next(createError(503, 'Service temporarily unavailable'));
    }

    const hasSufficient = await hasSufficientBalance(clientId, amount);

    if (!hasSufficient) {
      const requestInfo = {
        apiKeyName: req.apiKey?.name,
        endpoint: req.originalUrl,
        method: req.method,
        ipAddress: req.ip || req.connection.remoteAddress
      };

      emailService.sendClientErrorNotification(
        req.client,
        'INSUFFICIENT_BALANCE',
        `Insufficient wallet balance. Required: ${amount}, Available: ${wallet?.balance || 0}`,
        requestInfo
      );

      return next(createError(503, 'Service temporarily unavailable'));
    }

    // If we reach here, client has sufficient balance
    next();
  } catch (error) {
    next(error);
  }
};

export default checkWalletBalance;