import { sequelize } from '../config/database.js';
import { ClientWallet, WalletTransaction, Client } from '../models/index.js';
import createError from 'http-errors';

/**
 * Initialize a wallet for a new client
 * @param {string} clientId - Client ID
 * @param {number} initialBalance - Optional initial balance
 * @returns {Promise<Object>} Created wallet
 */
export const createWallet = async (clientId, initialBalance = 0) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if client exists
    const client = await Client.findByPk(clientId, { transaction });

    if (!client) {
      throw createError(404, 'Client not found');
    }

    // Check if wallet already exists
    const existingWallet = await ClientWallet.findOne({
      where: { clientId },
      transaction
    });

    if (existingWallet) {
      throw createError(409, 'Client already has a wallet');
    }

    // Create new wallet
    const wallet = await ClientWallet.create({
      clientId,
      balance: initialBalance,
      status: 'active',
      lowBalanceThreshold: 100.00, // Default threshold
      notificationEmail: client.email
    }, { transaction });

    // If there's an initial balance, create a transaction record
    if (initialBalance > 0) {
      await WalletTransaction.create({
        walletId: wallet.id,
        clientId,
        type: 'credit',
        amount: initialBalance,
        balanceBefore: 0,
        balanceAfter: initialBalance,
        description: 'Initial wallet funding',
        reference: `INIT-${Date.now()}`
      }, { transaction });
    }

    await transaction.commit();
    return wallet;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get client wallet details with balance
 * @param {string} clientId - Client ID
 * @returns {Promise<Object>} Wallet details
 */
export const getWallet = async (clientId) => {
  try {
    const wallet = await ClientWallet.findOne({
      where: { clientId },
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!wallet) {
      throw createError(404, 'Wallet not found for client');
    }

    return wallet;
  } catch (error) {
    throw error;
  }
};

/**
 * Add funds to client wallet
 * @param {string} clientId - Client ID
 * @param {number} amount - Amount to add
 * @param {string} description - Transaction description
 * @param {string} reference - External reference (optional)
 * @param {string} performedBy - User ID who performed this action (optional)
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const addFunds = async (clientId, amount, description, reference, performedBy = null) => {
  const transaction = await sequelize.transaction();

  try {
    if (amount <= 0) {
      throw createError(400, 'Amount must be greater than zero');
    }

    const wallet = await ClientWallet.findOne({
      where: { clientId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!wallet) {
      throw createError(404, 'Wallet not found for client');
    }

    if (wallet.status !== 'active') {
      throw createError(400, `Cannot add funds to ${wallet.status} wallet`);
    }

    const currentBalance = parseFloat(wallet.balance);
    const newBalance = currentBalance + parseFloat(amount);

    // Update wallet balance
    await wallet.update({
      balance: newBalance,
      lastTopupDate: new Date()
    }, { transaction });

    // Create transaction record
    const walletTransaction = await WalletTransaction.create({
      walletId: wallet.id,
      clientId,
      type: 'credit',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: description || 'Wallet topup',
      reference: reference || `TOPUP-${Date.now()}`,
      performedBy
    }, { transaction });

    await transaction.commit();

    return {
      wallet: await ClientWallet.findByPk(wallet.id),
      transaction: walletTransaction
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Deduct funds from client wallet for a topup request
 * @param {string} clientId - Client ID
 * @param {string} topUpRequestId - TopUp Request ID
 * @param {number} amount - Amount to deduct
 * @param {string} description - Transaction description
 * @param {Object} externalTransaction - Optional external transaction
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const deductFunds = async (clientId, topUpRequestId, amount, description, externalTransaction = null) => {
  const transaction = externalTransaction || await sequelize.transaction();
  const shouldCommit = !externalTransaction; // Only commit if we created the transaction

  try {
    if (amount <= 0) {
      throw createError(400, 'Amount must be greater than zero');
    }

    const wallet = await ClientWallet.findOne({
      where: { clientId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!wallet) {
      throw createError(404, 'Wallet not found for client');
    }

    if (wallet.status !== 'active') {
      throw createError(400, `Cannot deduct funds from ${wallet.status} wallet`);
    }

    const currentBalance = parseFloat(wallet.balance);

    // Check if there's enough balance
    if (currentBalance < amount) {
      throw createError(400, 'Insufficient wallet balance');
    }

    const newBalance = currentBalance - parseFloat(amount);

    // Update wallet balance
    await wallet.update({
      balance: newBalance
    }, { transaction });

    // Create transaction record
    const walletTransaction = await WalletTransaction.create({
      walletId: wallet.id,
      clientId,
      type: 'debit',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: description || 'Mobile topup',
      reference: `TOPUP-${Date.now()}`,
      topUpRequestId
    }, { transaction });

    // Check if wallet is now below threshold
    if (newBalance < wallet.lowBalanceThreshold) {
      // You could implement notifications here
    }

    if (shouldCommit) {
      await transaction.commit();
    }

    return {
      wallet: await ClientWallet.findByPk(wallet.id),
      transaction: walletTransaction
    };
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Get wallet transaction history
 * @param {string} clientId - Client ID
 * @param {Object} options - Query options (pagination, filters)
 * @returns {Promise<Object>} Transaction history
 */
export const getTransactionHistory = async (clientId, options = {}) => {
  try {
    const { page = 1, limit = 20, type, startDate, endDate, amount } = options;
    const offset = (page - 1) * limit;

    // Build query conditions
    const where = { clientId };

    if (type) {
      where.type = type;
    }

    if (amount) {
      where.amount = amount;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        where.createdAt.$lte = new Date(endDate);
      }
    }

    // Fetch transactions with pagination
    const { rows: transactions, count: total } = await WalletTransaction.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{
        model: ClientWallet,
        as: 'wallet',
        attributes: ['id', 'balance']
      }]
    });

    return {
      transactions,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Check if client has sufficient wallet balance for a transaction
 * @param {string} clientId - Client ID
 * @param {number} amount - Amount to check
 * @returns {Promise<boolean>} True if sufficient balance
 */
export const hasSufficientBalance = async (clientId, amount) => {
  try {
    const wallet = await ClientWallet.findOne({
      where: { clientId }
    });


    if (!wallet || wallet.status !== 'active') {
      return false;
    }

    return parseFloat(wallet.balance) >= parseFloat(amount);
  } catch (error) {
    return false;
  }
};

/**
 * Update wallet settings
 * @param {string} clientId - Client ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated wallet
 */
export const updateWalletSettings = async (clientId, updateData) => {
  try {
    const wallet = await ClientWallet.findOne({
      where: { clientId }
    });

    if (!wallet) {
      throw createError(404, 'Wallet not found for client');
    }

    const allowedFields = ['lowBalanceThreshold', 'notificationEmail', 'status'];
    const filteredUpdate = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    });

    await wallet.update(filteredUpdate);

    return wallet;
  } catch (error) {
    throw error;
  }
};

export default {
  createWallet,
  getWallet,
  addFunds,
  deductFunds,
  getTransactionHistory,
  hasSufficientBalance,
  updateWalletSettings
};