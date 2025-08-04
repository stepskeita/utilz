import createError from 'http-errors';
import { Client, ApiKey, ApiUsage, Op, sequelize } from '../models/index.js';

/**
 * Get all API keys
 * @returns {Promise<Array>} Array of API keys
 */
export const getAllApiKeys = async () => {
  const apiKeys = await ApiKey.findAll({

    include: [
      {
        model: Client,
        attributes: ['name', 'email']
      }
    ]
  });

  return apiKeys;
};

/**
 * Get an API key by ID
 * @param {string} id - API key ID
 * @returns {Promise<Object>} API key data
 * @throws {Error} If API key not found
 */
export const getApiKeyById = async (id) => {
  const apiKey = await ApiKey.findByPk(id, {
    attributes: ['id', 'name', 'key', 'clientId', 'isActive', 'expiresAt', 'lastUsedAt', 'createdAt', 'ipRestrictions'],
    include: [
      {
        model: Client,
        attributes: ['name', 'email']
      }
    ]
  });

  if (!apiKey) {
    throw createError(404, 'API key not found');
  }

  return apiKey;
};

/**
 * Get API keys for a specific client
 * @param {string} clientId - Client ID
 * @returns {Promise<Array>} Array of API keys
 * @throws {Error} If client not found
 */
export const getClientApiKeys = async (clientId) => {
  const client = await Client.findByPk(clientId);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  const apiKeys = await ApiKey.findAll({
    where: { clientId },
    attributes: ['id', 'name', 'key', 'isActive', 'expiresAt', 'lastUsedAt', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  return apiKeys;
};


export const getClientActiveApiKeys = async (clientId) => {
  const client = await Client.findByPk(clientId);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  const apiKeys = await ApiKey.findAll({
    where: { clientId, isActive: true },
    attributes: ['id', 'name', 'key', 'isActive', 'expiresAt', 'lastUsedAt', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  return apiKeys;
};

/**
 * Create a new API key for a client
 * @param {string} clientId - Client ID
 * @param {Object} apiKeyData - API key data
 * @returns {Promise<Object>} Created API key
 * @throws {Error} If client not found or inactive
 */
export const createApiKey = async (clientId, apiKeyData) => {
  const { name, expiresAt, permissions, ipRestrictions } = apiKeyData;

  const client = await Client.findByPk(clientId);

  if (!client) {
    throw createError(404, 'Client not found');
  }

  if (!client.isActive) {
    throw createError(400, 'Cannot create API key for inactive client');
  }

  const newApiKey = await ApiKey.create({
    clientId,
    name: name || 'Default Key',
    key: ApiKey.generateKey(),
    secretKey: ApiKey.generateSecretKey(),
    expiresAt: expiresAt || null,
    permissions: permissions || {},
    ipRestrictions: ipRestrictions || null
  });

  // Return only necessary data
  return {
    id: newApiKey.id,
    name: newApiKey.name,
    key: newApiKey.key,
    secretKey: newApiKey.secretKey, // Only returned at creation time
    expiresAt: newApiKey.expiresAt
  };
};

/**
 * Update an API key
 * @param {string} keyId - API key ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated API key
 * @throws {Error} If API key not found
 */
export const updateApiKey = async (keyId, updateData) => {
  const { name, isActive, expiresAt, permissions, ipRestrictions } = updateData;

  const apiKey = await ApiKey.findByPk(keyId);

  if (!apiKey) {
    throw createError(404, 'API key not found');
  }

  await apiKey.update({
    ...(name && { name }),
    ...(isActive !== undefined && { isActive }),
    ...(expiresAt !== undefined && { expiresAt }),
    ...(permissions && { permissions }),
    ...(ipRestrictions !== undefined && { ipRestrictions })
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    isActive: apiKey.isActive,
    expiresAt: apiKey.expiresAt
  };
};

/**
 * Revoke (deactivate) an API key
 * @param {string} keyId - API key ID
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If API key not found
 */
export const revokeApiKey = async (keyId) => {
  const apiKey = await ApiKey.findByPk(keyId);

  if (!apiKey) {
    throw createError(404, 'API key not found');
  }

  await apiKey.update({ isActive: false });

  return true;
};

/**
 * Get usage statistics for an API key
 * @param {string} keyId - API key ID
 * @param {Object} dateRange - Date range for statistics
 * @returns {Promise<Object>} Usage statistics
 * @throws {Error} If API key not found
 */
export const getApiKeyStats = async (keyId, dateRange = {}) => {
  const { startDate, endDate } = dateRange;

  const apiKey = await ApiKey.findByPk(keyId);

  if (!apiKey) {
    throw createError(404, 'API key not found');
  }

  // Build where clause based on date parameters
  let whereClause = { apiKeyId: keyId };

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

  // Get first and last activity
  const firstActivity = await ApiUsage.findOne({
    attributes: ['createdAt'],
    where: { apiKeyId: keyId },
    order: [['createdAt', 'ASC']]
  });

  const lastActivity = await ApiUsage.findOne({
    attributes: ['createdAt'],
    where: { apiKeyId: keyId },
    order: [['createdAt', 'DESC']]
  });

  return {
    totalCalls,
    successRate: successRate.toFixed(2),
    lastUsed: apiKey.lastUsedAt,
    dailyUsage,
    activityRange: {
      firstActivity: firstActivity?.createdAt || null,
      lastActivity: lastActivity?.createdAt || apiKey.lastUsedAt || null
    }
  };
};

export default {
  getAllApiKeys,
  getApiKeyById,
  getClientApiKeys,
  createApiKey,
  updateApiKey,
  revokeApiKey,
  getApiKeyStats,
  getClientActiveApiKeys
};