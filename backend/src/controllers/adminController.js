import clientWalletService from '../services/clientWalletService.js';
import { Client, ApiKey, UtilityTransaction, sequelize } from '../models/index.js';
import createError from 'http-errors';
import { Op } from 'sequelize';

class AdminController {
  /**
   * Get all clients
   */
  async getAllClients(req, res, next) {
    try {
      const { page, limit, search, status } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        search,
        status
      };

      const clients = await Client.findAndCountAll({
        where: {
          ...(search && {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } }
            ]
          }),
          ...(status && { isActive: status === 'active' })
        },
        include: [
          {
            model: sequelize.models.ClientWallet,
            as: 'wallet'
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: options.limit,
        offset: (options.page - 1) * options.limit
      });

      res.status(200).json({
        success: true,
        data: {
          clients: clients.rows,
          pagination: {
            total: clients.count,
            currentPage: options.page,
            limit: options.limit,
            totalPages: Math.ceil(clients.count / options.limit),
            hasPrevPage: options.page > 1,
            hasNextPage: options.page < Math.ceil(clients.count / options.limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client by ID
   */
  async getClient(req, res, next) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id, {
        include: [
          {
            model: sequelize.models.ClientWallet,
            as: 'wallet'
          },
          {
            model: ApiKey,
            as: 'apiKeys'
          }
        ]
      });

      if (!client) {
        throw createError(404, 'Client not found');
      }

      res.status(200).json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new client
   */
  async createClient(req, res, next) {
    try {
      const clientData = req.body;

      const client = await Client.create(clientData);

      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update client
   */
  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await Client.findByPk(id);

      if (!client) {
        throw createError(404, 'Client not found');
      }

      await client.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Client updated successfully',
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete client
   */
  async deleteClient(req, res, next) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id);

      if (!client) {
        throw createError(404, 'Client not found');
      }

      await client.destroy();

      res.status(200).json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all pending top-up requests
   */
  async getAllTopUpRequests(req, res, next) {
    try {
      const { page, limit, status, clientId } = req.query;

      const result = await clientWalletService.getAllTopUpRequests({
        page,
        limit,
        status,
        clientId
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific top-up request details
   */
  async getTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;

      const request = await clientWalletService.getTopUpRequest(id);

      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve top-up request
   */
  async approveTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;
      const adminId = req.user.id;
      const approvalData = req.body;

      const result = await clientWalletService.approveTopUpRequest(id, adminId, approvalData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          approvedAmount: result.approvedAmount,
          newBalance: result.newBalance
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject top-up request
   */
  async rejectTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;
      const adminId = req.user.id;
      const rejectionData = req.body;

      const result = await clientWalletService.rejectTopUpRequest(id, adminId, rejectionData);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get receipt as base64 image
   */
  async downloadReceipt(req, res, next) {
    try {
      const { requestId } = req.params;

      const request = await sequelize.models.ClientTopUpRequest.findByPk(requestId);

      if (!request) {
        throw createError(404, 'Top-up request not found');
      }

      if (!request.receiptFilePath || !request.receiptMimeType) {
        throw createError(404, 'Receipt file not found');
      }

      // Get receipt as base64
      const receiptBase64 = await clientWalletService.getReceiptAsBase64(
        request.receiptFilePath,
        request.receiptMimeType
      );

      res.status(200).json({
        success: true,
        data: {
          requestId: request.id,
          fileName: request.receiptFileName,
          mimeType: request.receiptMimeType,
          base64: receiptBase64
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get system analytics
   */
  async getSystemAnalytics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const whereClause = {};
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

      // Get client statistics
      const totalClients = await Client.count();
      const activeClients = await Client.count({
        where: { isActive: true }
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
          },
          clients: {
            total: totalClients,
            active: activeClients,
            inactive: totalClients - activeClients
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction history for admin
   */
  async getTransactionHistory(req, res, next) {
    try {
      const { page, limit, type, status, clientId, startDate, endDate } = req.query;

      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (clientId) whereClause.clientId = clientId;
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const transactions = await UtilityTransaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Client,
            attributes: ['id', 'name', 'email']
          }
        ],
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
   * Update client wallet balance
   */
  async updateClientWallet(req, res, next) {
    try {
      const { clientId } = req.params;
      const { amount, type, description } = req.body;

      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: sequelize.models.ClientWallet,
            as: 'wallet'
          }
        ]
      });

      if (!client) {
        throw createError(404, 'Client not found');
      }

      if (!client.wallet) {
        throw createError(404, 'Client wallet not found');
      }

      const oldBalance = client.wallet.balance;
      let newBalance;

      if (type === 'credit') {
        newBalance = oldBalance + parseFloat(amount);
      } else if (type === 'debit') {
        newBalance = oldBalance - parseFloat(amount);
        if (newBalance < 0) {
          throw createError(400, 'Insufficient balance for debit');
        }
      } else {
        throw createError(400, 'Invalid transaction type');
      }

      await client.wallet.update({ balance: newBalance });

      // Create wallet transaction record
      await sequelize.models.WalletTransaction.create({
        clientId,
        type,
        amount: parseFloat(amount),
        description: description || `Admin ${type} - ${amount}`,
        balanceBefore: oldBalance,
        balanceAfter: newBalance,
        adminId: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Wallet updated successfully',
        data: {
          oldBalance,
          newBalance,
          change: type === 'credit' ? amount : -amount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== API KEY MANAGEMENT METHODS ====================

  /**
   * Get all API keys
   */
  async getAllApiKeys(req, res, next) {
    try {
      const { page, limit, search, clientId, status, service } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        search,
        clientId,
        status,
        service
      };

      const whereClause = {
        ...(search && {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { key: { [Op.like]: `%${search}%` } }
          ]
        }),
        ...(clientId && { clientId }),
        ...(status && {
          isActive: status === 'active'
        }),
        ...(service && {
          ...(service === 'airtime' && { isAirtime: true, isBoth: false }),
          ...(service === 'cashpower' && { isCashpower: true, isBoth: false }),
          ...(service === 'both' && { isBoth: true })
        })
      };

      const apiKeys = await ApiKey.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Client,
            attributes: ['id', 'name', 'email']
          }
        ],
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
            hasPrevPage: options.page > 1,
            hasNextPage: options.page < Math.ceil(apiKeys.count / options.limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get API key by ID
   */
  async getApiKeyById(req, res, next) {
    try {
      const { id } = req.params;

      const apiKey = await ApiKey.findByPk(id, {
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!apiKey) {
        throw createError(404, 'API key not found');
      }

      res.status(200).json({
        success: true,
        data: apiKey
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create API key for client
   */
  async createApiKey(req, res, next) {
    try {
      const { clientId } = req.params;
      const apiKeyData = req.body;

      const client = await Client.findByPk(clientId);
      if (!client) {
        throw createError(404, 'Client not found');
      }

      const apiKey = await ApiKey.create({
        ...apiKeyData,
        clientId,
        key: ApiKey.generateKey(),
        secretKey: ApiKey.generateSecretKey()
      });

      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        data: apiKey
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
      const { id } = req.params;
      const updateData = req.body;

      const apiKey = await ApiKey.findByPk(id);
      if (!apiKey) {
        throw createError(404, 'API key not found');
      }

      await apiKey.update(updateData);

      res.status(200).json({
        success: true,
        message: 'API key updated successfully',
        data: apiKey
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
      const { id } = req.params;

      const apiKey = await ApiKey.findByPk(id);
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
      const { id } = req.params;

      const apiKey = await ApiKey.findByPk(id);
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
          key: newKey
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== BALANCE MONITORING METHODS ====================

  /**
   * Manually trigger balance check
   */
  async checkBalance(req, res, next) {
    try {
      // This would integrate with the balance monitoring service
      res.status(200).json({
        success: true,
        message: 'Balance check triggered successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current balance status
   */
  async getBalanceStatus(req, res, next) {
    try {
      // This would return current balance status
      res.status(200).json({
        success: true,
        data: {
          currentBalance: 0,
          status: 'normal',
          lastChecked: new Date()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send test balance alert email
   */
  async sendTestAlert(req, res, next) {
    try {
      // This would send a test alert email
      res.status(200).json({
        success: true,
        message: 'Test alert sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monitoring service status
   */
  async getMonitoringStatus(req, res, next) {
    try {
      // This would return monitoring service status
      res.status(200).json({
        success: true,
        data: {
          isActive: true,
          lastCheck: new Date(),
          nextCheck: new Date(Date.now() + 300000), // 5 minutes from now
          alertsEnabled: true
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new AdminController();

export const {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getAllTopUpRequests,
  getTopUpRequest,
  approveTopUpRequest,
  rejectTopUpRequest,
  downloadReceipt,
  getSystemAnalytics,
  getTransactionHistory,
  updateClientWallet,
  getAllApiKeys,
  getApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  regenerateApiKey,
  checkBalance,
  getBalanceStatus,
  sendTestAlert,
  getMonitoringStatus
} = controller;

export default controller; 