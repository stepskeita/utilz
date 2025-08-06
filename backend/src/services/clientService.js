import { Client, ApiKey, ApiUsage, ClientWallet, WalletTransaction } from '../models/index.js';
import createError from 'http-errors';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';
import { createWallet } from './walletService.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

/**
 * Get all clients with basic information including wallet details
 * @returns {Promise<Array>} Array of clients with wallet info
 */
export const getAllClients = async () => {
  const clients = await Client.findAll({
    attributes: ['id', 'name', 'email', 'contactPerson', 'isActive', 'plan', 'createdAt'],
    include: [{
      model: ClientWallet,
      as: 'wallet',
      attributes: ['id', 'balance', 'status', 'lastTopupDate', 'lowBalanceThreshold']
    }]
  });

  return clients;
};

/**
 * Get a client by ID
 * @param {string} id - Client ID
 * @returns {Promise<Object>} Client data
 * @throws {Error} If client not found
 */
export const getClientById = async (id) => {
  const client = await Client.findByPk(id);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  return client;
};


/**
 * Create a new client
 * @param {Object} clientData - Client data
 * @param {number} initialWalletBalance - Optional initial wallet balance
 * @returns {Promise<Object>} Created client with API key
 */
export const createClient = async (clientData, initialWalletBalance = 0) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if client with this email already exists
    const existingClient = await Client.findOne({
      where: { email: clientData.email },
      transaction
    });

    if (existingClient) {
      throw createError(409, 'Client with this email already exists');
    }

    // Set default password and hash it
    const defaultPassword = 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create the client with hashed default password
    const client = await Client.create({
      ...clientData,
      password: hashedPassword
    }, { transaction });


    // Check if wallet already exists
    const existingWallet = await ClientWallet.findOne({
      where: { clientId: client.id },
      transaction
    });

    if (existingWallet) {
      throw createError(409, 'Client already has a wallet');
    }

    // Create new wallet
    const wallet = await ClientWallet.create({
      clientId: client.id,
      balance: initialWalletBalance,
      status: 'active',
      lowBalanceThreshold: 100.00, // Default threshold
      notificationEmail: client.email
    }, { transaction });

    // If there's an initial balance, create a transaction record
    if (initialWalletBalance > 0) {
      await WalletTransaction.create({
        walletId: wallet.id,
        clientId: client.id,
        type: 'credit',
        amount: initialWalletBalance,
        balanceBefore: 0,
        balanceAfter: initialWalletBalance,
        description: 'Initial wallet funding',
        reference: `INIT-${Date.now()}`
      }, { transaction });
    }
    await transaction.commit();

    return {
      client,
      wallet
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


/**
 * Update a client
 * @param {string} id - Client ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated client
 * @throws {Error} If client not found
 */
export const updateClient = async (id, updateData) => {
  const {
    name, email, contactPerson, contactPhone,
    address, website, isActive, plan,
    monthlyQuota, notes
  } = updateData;

  const client = await Client.findByPk(id);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  await client.update({
    ...(name && { name }),
    ...(email && { email }),
    ...(contactPerson && { contactPerson }),
    ...(contactPhone !== undefined && { contactPhone }),
    ...(address !== undefined && { address }),
    ...(website !== undefined && { website }),
    ...(isActive !== undefined && { isActive }),
    ...(plan && { plan }),
    ...(monthlyQuota && { monthlyQuota }),
    ...(notes !== undefined && { notes })
  });

  return client;
};

/**
 * Deactivate a client and their API keys
 * @param {string} id - Client ID
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If client not found
 */
export const deactivateClient = async (id) => {
  const client = await Client.findByPk(id);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  // Instead of physically deleting, deactivate the client
  await client.update({ isActive: false });

  // Also deactivate all associated API keys
  await ApiKey.update(
    { isActive: false },
    { where: { clientId: id } }
  );

  return true;
};



/**
 * Get usage statistics for a client
 * @param {string} id - Client ID
 * @param {Object} dateRange - Date range for statistics
 * @returns {Promise<Object>} Usage statistics
 * @throws {Error} If client not found
 */
export const getClientUsageStats = async (id, dateRange = {}) => {
  const { startDate, endDate } = dateRange || {};

  const client = await Client.findByPk(id);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  // For now, return basic stats from existing data
  // Get API keys count
  const apiKeys = await ApiKey.findAll({
    where: { clientId: id }
  });

  // Get wallet transactions as a proxy for activity
  const walletTransactions = await WalletTransaction.findAll({
    where: { clientId: id },
    ...(startDate && endDate && {
      where: {
        clientId: id,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      }
    })
  });

  // Calculate basic stats
  const totalApiKeys = apiKeys.length;
  const activeApiKeys = apiKeys.filter(key => key.isActive).length;
  const totalTransactions = walletTransactions.length;

  // Get first and last transaction dates
  const firstTransaction = walletTransactions.length > 0
    ? walletTransactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]
    : null;

  const lastTransaction = walletTransactions.length > 0
    ? walletTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null;

  return {
    totalApiKeys,
    activeApiKeys,
    totalTransactions,
    successRate: "98.5", // Mock data for now
    totalCalls: totalTransactions * 5, // Mock multiplier
    endpointUsage: [
      { endpoint: '/api/v1/airtime', count: Math.floor(totalTransactions * 0.6) },
      { endpoint: '/api/v1/cashpower', count: Math.floor(totalTransactions * 0.4) }
    ],
    dailyUsage: [], // Mock empty for now
    totalTransactionAmount: walletTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0),
    dateRange: {
      firstActivity: firstTransaction?.createdAt || null,
      lastActivity: lastTransaction?.createdAt || null,
      filtered: !!(startDate || endDate)
    },
    monthlyUsage: [],
    usageByKey: apiKeys.map(key => ({
      apiKeyId: key.id,
      ApiKey: { name: key.name, key: key.key.substring(0, 8) + '...' },
      count: Math.floor(Math.random() * 100) + 1 // Mock data
    }))
  };
};


/**
 * Generate a unique API key
 * @returns {string} Unique API key
 */
const generateApiKey = () => {
  return uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').substring(0, 8);
};

export default {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deactivateClient,
  getClientUsageStats
};