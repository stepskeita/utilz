import apiKeyService from '../services/apiKeyService.js';

/**
 * Get all API keys
 */
export const getAllApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await apiKeyService.getAllApiKeys();

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get API key by ID
 */
export const getApiKeyById = async (req, res, next) => {
  try {
    const apiKey = await apiKeyService.getApiKeyById(req.params.id);

    res.status(200).json({
      success: true,
      data: apiKey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get API keys for a specific client
 */
export const getClientApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await apiKeyService.getClientApiKeys(req.params.clientId);

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    next(error);
  }
};


export const getClientActiveApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await apiKeyService.getClientActiveApiKeys(req.params.clientId);

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    next(error);
  }
};




/**
 * Create a new API key
 */
export const createApiKey = async (req, res, next) => {
  try {
    const newApiKey = await apiKeyService.createApiKey(req.params.clientId, req.body);

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: newApiKey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an API key
 */
export const updateApiKey = async (req, res, next) => {
  try {
    const updatedApiKey = await apiKeyService.updateApiKey(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'API key updated successfully',
      data: updatedApiKey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke (deactivate) an API key
 */
export const revokeApiKey = async (req, res, next) => {
  try {
    await apiKeyService.revokeApiKey(req.params.id);

    res.status(200).json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get usage statistics for an API key
 */
export const getApiKeyStats = async (req, res, next) => {
  try {
    const stats = await apiKeyService.getApiKeyStats(
      req.params.id,
      { startDate: req.query.startDate, endDate: req.query.endDate }
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllApiKeys,
  getApiKeyById,
  getClientApiKeys,
  createApiKey,
  updateApiKey,
  revokeApiKey,
  getApiKeyStats
};