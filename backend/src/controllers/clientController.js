import clientService from '../services/clientService.js';
import { Client, ApiKey, UtilityTransaction, sequelize } from '../models/index.js';
import createError from 'http-errors';
import { Op } from 'sequelize';

class ClientController {
  /**
   * Get client profile
   */
  async getClientProfile(req, res, next) {
    try {
      const clientId = req.client.id;

      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: sequelize.models.ClientWallet,
            as: 'wallet'
          },
          {
            model: ApiKey,
            as: 'ApiKeys',
            attributes: ['id', 'name', 'isActive', 'isAirtime', 'isCashpower', 'isBoth', 'createdAt']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update client profile
   */
  async updateClientProfile(req, res, next) {
    try {
      const clientId = req.client.id;
      const updateData = req.body;

      // Prevent updating sensitive fields
      delete updateData.password;
      delete updateData.isActive;
      delete updateData.plan;
      delete updateData.monthlyQuota;

      const client = await Client.findByPk(clientId);

      if (!client) {
        throw createError(404, 'Client not found');
      }

      await client.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change client password
   */
  async changePassword(req, res, next) {
    try {
      const clientId = req.client.id;
      const { currentPassword, newPassword } = req.body;

      const client = await Client.findByPk(clientId);

      if (!client) {
        throw createError(404, 'Client not found');
      }

      // Verify current password
      const isValidPassword = await client.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw createError(400, 'Current password is incorrect');
      }

      // Update password
      client.password = newPassword;
      await client.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client wallet balance
   */
  async getWalletBalance(req, res, next) {
    try {
      const clientId = req.client.id;

      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: sequelize.models.ClientWallet,
            as: 'wallet'
          }
        ]
      });

      if (!client.wallet) {
        throw createError(404, 'Wallet not found');
      }

      res.status(200).json({
        success: true,
        data: {
          balance: client.wallet.balance,
          currency: 'DAL',
          lastUpdated: client.wallet.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client wallet transactions
   */
  async getWalletTransactions(req, res, next) {
    try {
      const clientId = req.client.id;
      const { page, limit, type, startDate, endDate } = req.query;

      const whereClause = { clientId };
      if (type) whereClause.type = type;
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const transactions = await sequelize.models.WalletTransaction.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit) || 50,
        offset: (parseInt(page) - 1) * (parseInt(limit) || 50)
      });

      res.status(200).json({
        success: true,
        data: {
          transactions: transactions.rows,
          pagination: {
            total: transactions.count,
            currentPage: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            totalPages: Math.ceil(transactions.count / (parseInt(limit) || 50)),
            hasPrevPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) < Math.ceil(transactions.count / (parseInt(limit) || 50))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client transaction history
   */
  async getTransactionHistory(req, res, next) {
    try {
      const clientId = req.client.id;
      const { page, limit, type, status, startDate, endDate } = req.query;

      const whereClause = { clientId };
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const transactions = await UtilityTransaction.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit) || 50,
        offset: (parseInt(page) - 1) * (parseInt(limit) || 50)
      });

      res.status(200).json({
        success: true,
        data: {
          transactions: transactions.rows,
          pagination: {
            total: transactions.count,
            currentPage: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            totalPages: Math.ceil(transactions.count / (parseInt(limit) || 50)),
            hasPrevPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) < Math.ceil(transactions.count / (parseInt(limit) || 50))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client API keys
   */
  async getApiKeys(req, res, next) {
    try {
      const clientId = req.client.id;
      const { search, status, service, page = 1, limit = 10 } = req.query;

      // Build where clause
      const whereClause = {
        clientId,
        ...(search && {
          name: {
            [Op.like]: `%${search}%`
          }
        }),
        ...(status && {
          isActive: status === 'active'
        }),
        ...(service && {
          ...(service === 'airtime' && { isAirtime: true, isBoth: false }),
          ...(service === 'cashpower' && { isCashpower: true, isBoth: false }),
          ...(service === 'both' && { isBoth: true })
        })
      };

      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const apiKeys = await ApiKey.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'name', 'key', 'secretKey', 'isActive', 'isAirtime', 'isCashpower', 'isBoth', 'createdAt', 'expiresAt', 'lastUsedAt'],
        order: [['createdAt', 'DESC']],
        limit: options.limit,
        offset: (options.page - 1) * options.limit
      });

      res.status(200).json({
        success: true,
        data: {
          apiKeys: apiKeys.rows,
          pagination: {
            total: apiKeys.count,
            currentPage: options.page,
            limit: options.limit,
            totalPages: Math.ceil(apiKeys.count / options.limit),
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new API key
   */
  async createApiKey(req, res, next) {
    try {
      const clientId = req.client.id;
      const { name, isAirtime, isCashpower, isBoth, expiresAt, ipRestrictions } = req.body;

      const apiKey = await ApiKey.create({
        clientId,
        name,
        isActive: false, // All new keys are inactive by default
        isAirtime: isAirtime || false,
        isCashpower: isCashpower || false,
        isBoth: isBoth || false,
        expiresAt,
        ipRestrictions,
        key: ApiKey.generateKey(),
        secretKey: ApiKey.generateSecretKey()
      });

      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        data: {
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key,
          isAirtime: apiKey.isAirtime,
          isCashpower: apiKey.isCashpower,
          isBoth: apiKey.isBoth,
          expiresAt: apiKey.expiresAt,
          createdAt: apiKey.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update API key
   */
  async updateApiKey(req, res, next) {
    try {
      const clientId = req.client.id;
      const { id } = req.params;
      const updateData = req.body;

      // Remove isActive from update data - only admins can control activation
      const { isActive, ...allowedUpdateData } = updateData;

      const apiKey = await ApiKey.findOne({
        where: { id, clientId }
      });

      if (!apiKey) {
        throw createError(404, 'API key not found');
      }

      await apiKey.update(allowedUpdateData);

      res.status(200).json({
        success: true,
        message: 'API key updated successfully',
        data: {
          id: apiKey.id,
          name: apiKey.name,
          isAirtime: apiKey.isAirtime,
          isCashpower: apiKey.isCashpower,
          isBoth: apiKey.isBoth,
          expiresAt: apiKey.expiresAt,
          updatedAt: apiKey.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete API key
   */
  async deleteApiKey(req, res, next) {
    try {
      const clientId = req.client.id;
      const { id } = req.params;

      const apiKey = await ApiKey.findOne({
        where: { id, clientId }
      });

      if (!apiKey) {
        throw createError(404, 'API key not found');
      }

      await apiKey.destroy();

      res.status(200).json({
        success: true,
        message: 'API key deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey(req, res, next) {
    try {
      const clientId = req.client.id;
      const { id } = req.params;

      const apiKey = await ApiKey.findOne({
        where: { id, clientId }
      });

      if (!apiKey) {
        throw createError(404, 'API key not found');
      }

      const newKey = ApiKey.generateKey();
      const newSecretKey = ApiKey.generateSecretKey();
      await apiKey.update({ key: newKey, secretKey: newSecretKey });

      res.status(200).json({
        success: true,
        message: 'API key regenerated successfully',
        data: {
          id: apiKey.id,
          name: apiKey.name,
          key: newKey,
          updatedAt: apiKey.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client usage statistics
   */
  async getUsageStats(req, res, next) {
    try {
      const clientId = req.client.id;
      const { startDate, endDate } = req.query;

      const whereClause = { clientId };
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Get transaction statistics
      const airtimeTransactions = await UtilityTransaction.count({
        where: {
          ...whereClause,
          type: 'airtime'
        }
      });

      const cashpowerTransactions = await UtilityTransaction.count({
        where: {
          ...whereClause,
          type: 'cashpower'
        }
      });

      const successfulTransactions = await UtilityTransaction.count({
        where: {
          ...whereClause,
          status: 'success'
        }
      });

      const failedTransactions = await UtilityTransaction.count({
        where: {
          ...whereClause,
          status: 'fail'
        }
      });

      // Get total amounts
      const airtimeAmount = await UtilityTransaction.sum('amount', {
        where: {
          ...whereClause,
          type: 'airtime',
          status: 'success'
        }
      });

      const cashpowerAmount = await UtilityTransaction.sum('amount', {
        where: {
          ...whereClause,
          type: 'cashpower',
          status: 'success'
        }
      });

      res.status(200).json({
        success: true,
        data: {
          transactions: {
            airtime: airtimeTransactions,
            cashpower: cashpowerTransactions,
            successful: successfulTransactions,
            failed: failedTransactions,
            total: airtimeTransactions + cashpowerTransactions
          },
          amounts: {
            airtime: airtimeAmount || 0,
            cashpower: cashpowerAmount || 0,
            total: (airtimeAmount || 0) + (cashpowerAmount || 0)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ClientController();

export const {
  getClientProfile,
  updateClientProfile,
  changePassword,
  getWalletBalance,
  getWalletTransactions,
  getTransactionHistory,
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  regenerateApiKey,
  getUsageStats
} = controller;

export default controller;