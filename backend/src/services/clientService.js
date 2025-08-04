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

  // Build where clause based on date parameters
  let whereClause = { clientId: id };

  // Only add date filters if both dates are provided or use default 30-day range
  if (startDate || endDate) {
    // Parse dates or use defaults
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    whereClause.createdAt = {
      [Op.between]: [start, end]
    };
  }

  // Get total API calls
  const totalCalls = await ApiUsage.count({
    where: whereClause
  });

  // Get success rate
  const successfulCalls = await ApiUsage.count({
    where: {
      ...whereClause,
      statusCode: {
        [Op.lt]: 400
      }
    }
  });

  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  // Get endpoint usage
  const endpointUsage = await ApiUsage.findAll({
    attributes: [
      'endpoint',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: whereClause,
    group: ['endpoint'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 10
  });

  // Get daily usage
  const dailyUsage = await ApiUsage.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: whereClause,
    group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
    order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
  });

  // Get total transaction amount
  const totalTransactionAmount = await ApiUsage.sum('transactionAmount', {
    where: {
      ...whereClause,
      transactionAmount: {
        [Op.ne]: null
      }
    }
  });

  // Get first and last activity dates
  const firstActivity = await ApiUsage.findOne({
    attributes: ['createdAt'],
    where: { clientId: id },
    order: [['createdAt', 'ASC']]
  });

  const lastActivity = await ApiUsage.findOne({
    attributes: ['createdAt'],
    where: { clientId: id },
    order: [['createdAt', 'DESC']]
  });

  // Get monthly usage breakdown
  const monthlyUsage = await ApiUsage.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: { clientId: id },
    group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
    order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
  });

  // Get usage by API key
  const usageByKey = await ApiUsage.findAll({
    attributes: [
      'apiKeyId',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: whereClause,
    include: [
      {
        model: ApiKey,
        attributes: ['name', 'key'],
        required: true
      }
    ],
    group: ['apiKeyId', 'ApiKey.id'], // Include ApiKey.id to avoid grouping errors
    order: [[sequelize.literal('count'), 'DESC']]
  });

  return {
    totalCalls,
    successRate: successRate.toFixed(2),
    endpointUsage,
    dailyUsage,
    totalTransactionAmount: totalTransactionAmount || 0,
    dateRange: {
      firstActivity: firstActivity?.createdAt || null,
      lastActivity: lastActivity?.createdAt || null,
      filtered: !!(startDate || endDate)
    },
    monthlyUsage,
    usageByKey
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