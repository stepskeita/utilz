import ClientWallet from '../models/ClientWallet.js';
import walletService from '../services/walletService.js';


/**
 * Create a new wallet for a client
 */

export const createWallet = async (req, res, next) => {
  try {
    const clientId = req.body.clientId;

    // Check if wallet already exists
    const existingWallet = await ClientWallet.findByPk(clientId);
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet already exists'
      });
    }

    // Create a new wallet
    const wallet = await walletService.createWallet(clientId);

    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      data: wallet
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get client wallet details
 */
export const getClientWallet = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.client?.id;



    const wallet = await walletService.getWallet(clientId);

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add funds to client wallet
 */
export const addFunds = async (req, res, next) => {
  try {
    const { clientId, amount, description, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }



    const result = await walletService.addFunds(
      clientId,
      amount,
      description,
      reference,
      req.user?.id // Performed by (if user is logged in)
    );

    res.status(200).json({
      success: true,
      message: 'Funds added successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get wallet transaction history
 */
export const getTransactionHistory = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.client?.id;


    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const history = await walletService.getTransactionHistory(clientId, options);

    res.status(200).json({
      success: true,
      data: history.transactions,
      pagination: history.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getClientWalletTransactionHistory = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.client?.id;


    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      amount: req.query.amount,
    };

    const history = await walletService.getTransactionHistory(clientId, options);

    res.status(200).json({
      success: true,
      data: history.transactions,
      pagination: history.pagination
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Update wallet settings
 */
export const updateWalletSettings = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.client?.id;



    const wallet = await walletService.updateWalletSettings(clientId, req.body);

    res.status(200).json({
      success: true,
      message: 'Wallet settings updated successfully',
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getClientWallet,
  addFunds,
  getTransactionHistory,
  updateWalletSettings,
  getClientWalletTransactionHistory
};