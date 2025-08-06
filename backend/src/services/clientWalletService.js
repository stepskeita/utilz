import createError from 'http-errors';
import { ClientWallet, WalletTransaction, UtilityTransaction, Client, ClientTopUpRequest, User, sequelize } from '../models/index.js';
import emailService from './emailService.js';
import moment from 'moment';
import { Op } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';

class ClientWalletService {
  /**
   * Get client wallet balance and details
   */
  async getWalletBalance(clientId) {
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
        throw createError(404, 'Wallet not found');
      }

      return {
        balance: wallet.balance,
        status: wallet.status,
        lastUpdated: wallet.updatedAt,
        client: wallet.client
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(clientId, filters = {}) {
    try {
      const whereClause = { clientId };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.startDate && filters.endDate) {
        whereClause.createdAt = {
          [sequelize.Op.between]: [
            new Date(filters.startDate),
            new Date(filters.endDate)
          ]
        };
      }

      const transactions = await WalletTransaction.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        include: [{
          model: UtilityTransaction,
          as: 'utilityTransaction',
          attributes: ['type', 'networkCode', 'phoneNumber', 'meterNumber']
        }]
      });

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request manual airtime top-up
   */
  async requestManualAirtime(clientId, requestData) {
    try {
      const { amount, phoneNumber, provider, paymentMethod, paymentReference, notes } = requestData;

      // Create manual airtime request
      const utilityTransaction = await UtilityTransaction.create({
        clientId,
        type: 'airtime',
        networkCode: provider,
        phoneNumber,
        amount,
        transactionReference: `MANUAL_${Date.now()}`,
        status: 'pending',
        metaData: {
          paymentMethod,
          paymentReference,
          notes,
          requestType: 'manual'
        }
      });

      // Send notification to admin
      await emailService.sendAdminNotification(
        'MANUAL_AIRTIME_REQUEST',
        {
          clientId,
          amount,
          phoneNumber,
          provider,
          paymentMethod,
          paymentReference,
          notes
        }
      );

      return {
        success: true,
        message: 'Manual airtime request submitted successfully',
        transactionId: utilityTransaction.id
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload receipt for manual airtime request
   */
  async uploadReceipt(transactionId, receiptData) {
    try {
      const { receiptUrl, receiptNumber, paymentDate, amount } = receiptData;

      const transaction = await UtilityTransaction.findByPk(transactionId);

      if (!transaction) {
        throw createError(404, 'Transaction not found');
      }

      if (transaction.type !== 'airtime') {
        throw createError(400, 'Invalid transaction type');
      }

      // Update transaction with receipt information
      await transaction.update({
        metaData: {
          ...transaction.metaData,
          receiptUrl,
          receiptNumber,
          paymentDate,
          uploadedAmount: amount,
          receiptUploadedAt: new Date()
        }
      });

      // Send notification to admin
      await emailService.sendAdminNotification(
        'RECEIPT_UPLOADED',
        {
          transactionId,
          receiptUrl,
          receiptNumber,
          paymentDate,
          amount
        }
      );

      return {
        success: true,
        message: 'Receipt uploaded successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve manual airtime request
   */
  async approveManualAirtime(transactionId, adminId, approvalData) {
    try {
      const { approvedAmount, adminNotes } = approvalData;

      const transaction = await UtilityTransaction.findByPk(transactionId);

      if (!transaction) {
        throw createError(404, 'Transaction not found');
      }

      if (transaction.type !== 'airtime') {
        throw createError(400, 'Invalid transaction type');
      }

      if (transaction.status !== 'pending') {
        throw createError(400, 'Transaction is not pending approval');
      }

      // Update transaction status
      await transaction.update({
        status: 'approved',
        amount: approvedAmount,
        metaData: {
          ...transaction.metaData,
          adminNotes,
          approvedBy: adminId,
          approvedAt: new Date()
        }
      });

      // Send notification to client
      await emailService.sendClientNotification(
        transaction.clientId,
        'MANUAL_AIRTIME_APPROVED',
        {
          transactionId,
          approvedAmount,
          adminNotes
        }
      );

      return {
        success: true,
        message: 'Manual airtime request approved successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reject manual airtime request
   */
  async rejectManualAirtime(transactionId, adminId, rejectionData) {
    try {
      const { rejectionReason, adminNotes } = rejectionData;

      const transaction = await UtilityTransaction.findByPk(transactionId);

      if (!transaction) {
        throw createError(404, 'Transaction not found');
      }

      if (transaction.type !== 'airtime') {
        throw createError(400, 'Invalid transaction type');
      }

      if (transaction.status !== 'pending') {
        throw createError(400, 'Transaction is not pending approval');
      }

      // Update transaction status
      await transaction.update({
        status: 'rejected',
        errorMessage: rejectionReason,
        metaData: {
          ...transaction.metaData,
          adminNotes,
          rejectedBy: adminId,
          rejectedAt: new Date()
        }
      });

      // Send notification to client
      await emailService.sendClientNotification(
        transaction.clientId,
        'MANUAL_AIRTIME_REJECTED',
        {
          transactionId,
          rejectionReason,
          adminNotes
        }
      );

      return {
        success: true,
        message: 'Manual airtime request rejected'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet statistics
   */
  async getWalletStatistics(clientId, period = '30d') {
    try {
      const startDate = moment().subtract(period === '30d' ? 30 : 7, 'days').toDate();

      const [totalTransactions, totalAmount, successTransactions] = await Promise.all([
        WalletTransaction.count({
          where: {
            clientId,
            createdAt: {
              [sequelize.Op.gte]: startDate
            }
          }
        }),
        WalletTransaction.sum('amount', {
          where: {
            clientId,
            type: 'debit',
            createdAt: {
              [sequelize.Op.gte]: startDate
            }
          }
        }),
        UtilityTransaction.count({
          where: {
            clientId,
            type: 'airtime',
            status: 'success',
            createdAt: {
              [sequelize.Op.gte]: startDate
            }
          }
        })
      ]);

      return {
        totalTransactions,
        totalAmount: totalAmount || 0,
        successTransactions,
        period
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get client's own top-up requests
   */
  async getTopUpRequests(clientId, options = {}) {
    try {
      const { page = 1, limit = 20, status } = options;
      const whereClause = { clientId };

      if (status) {
        whereClause.status = status;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await ClientTopUpRequest.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'processor',
            attributes: ['id', 'email', 'role'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        topUpRequests: rows,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalItems: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all top-up requests (Admin)
   */
  async getAllTopUpRequests(filters = {}) {
    try {
      const { page = 1, limit = 10, status, clientId } = filters;
      const whereClause = {};

      if (status) {
        whereClause.status = status;
      }

      if (clientId) {
        whereClause.clientId = clientId;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await ClientTopUpRequest.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'processor',
            attributes: ['id', 'email', 'role'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        topUpRequests: rows,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalItems: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get specific top-up request (Admin)
   */
  async getTopUpRequest(requestId) {
    try {
      const request = await ClientTopUpRequest.findByPk(requestId, {
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'processor',
            attributes: ['id', 'email', 'role'],
            required: false
          }
        ]
      });

      if (!request) {
        throw createError(404, 'Top-up request not found');
      }

      // Convert to plain object for modification
      const requestData = request.toJSON();

      // Add receiptBase64 if receipt file exists
      if (requestData.receiptFilePath && requestData.receiptMimeType) {
        try {
          requestData.receiptBase64 = await this.getReceiptAsBase64(
            requestData.receiptFilePath,
            requestData.receiptMimeType
          );
        } catch (error) {
          // If file not found, set receiptBase64 to null but don't fail the request
          console.warn(`Receipt file not found for request ${requestId}:`, error.message);
          requestData.receiptBase64 = null;
        }
      } else {
        requestData.receiptBase64 = null;
      }

      return requestData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create top-up request
   */
  async createTopUpRequest(clientId, requestData, receiptFile) {
    try {
      const { requestedAmount, paymentMethod, paymentReference, clientNotes } = requestData;

      // Handle file upload - save to disk
      const receiptFileName = receiptFile.name;
      const timestamp = Date.now();
      const safeFileName = `${timestamp}_${receiptFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const receiptFilePath = `/uploads/receipts/${safeFileName}`;
      const fullFilePath = path.join(process.cwd(), 'uploads', 'receipts', safeFileName);

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'uploads', 'receipts');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Save file to disk
      await fs.writeFile(fullFilePath, receiptFile.data);

      const topUpRequest = await ClientTopUpRequest.create({
        clientId,
        requestedAmount: parseFloat(requestedAmount),
        receiptFileName,
        receiptFilePath,
        receiptFileSize: receiptFile.size,
        receiptMimeType: receiptFile.mimetype,
        paymentMethod,
        paymentReference,
        clientNotes,
        status: 'pending'
      });

      // Send notification to admin
      await emailService.sendAdminNotification(
        'NEW_TOPUP_REQUEST',
        {
          clientId,
          requestId: topUpRequest.id,
          requestedAmount,
          paymentMethod,
          paymentReference
        }
      );

      return topUpRequest;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve top-up request
   */
  async approveTopUpRequest(requestId, adminId, approvalData) {
    const transaction = await sequelize.transaction();

    try {
      const { approvedAmount, adminNotes } = approvalData;

      const request = await ClientTopUpRequest.findByPk(requestId, { transaction });

      if (!request) {
        throw createError(404, 'Top-up request not found');
      }

      if (request.status !== 'pending') {
        throw createError(400, 'Request has already been processed');
      }

      // Update the request
      await request.update({
        status: 'approved',
        approvedAmount: parseFloat(approvedAmount),
        adminNotes,
        processedBy: adminId,
        processedAt: new Date()
      }, { transaction });

      // Add funds to client wallet
      const wallet = await ClientWallet.findOne({
        where: { clientId: request.clientId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!wallet) {
        throw createError(404, 'Client wallet not found');
      }

      const currentBalance = parseFloat(wallet.balance);
      const newBalance = currentBalance + parseFloat(approvedAmount);

      await wallet.update({
        balance: newBalance,
        lastTopupDate: new Date()
      }, { transaction });

      // Create wallet transaction record
      await WalletTransaction.create({
        walletId: wallet.id,
        clientId: request.clientId,
        type: 'credit',
        amount: parseFloat(approvedAmount),
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        description: `Top-up request approved - ${request.id}`,
        reference: `TOPUP-APPROVED-${request.id}`,
        performedBy: adminId
      }, { transaction });

      await transaction.commit();

      // Send notification to client
      await emailService.sendClientNotification(
        request.clientId,
        'TOPUP_APPROVED',
        {
          requestId,
          approvedAmount,
          newBalance,
          adminNotes
        }
      );

      return {
        message: 'Top-up request approved successfully',
        approvedAmount: parseFloat(approvedAmount),
        newBalance
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get receipt file as base64 string
   */
  async getReceiptAsBase64(receiptFilePath, mimeType) {
    try {
      // Convert relative path to absolute path
      const fullFilePath = path.join(process.cwd(), receiptFilePath.replace(/^\//, ''));

      // Check if file exists
      try {
        await fs.access(fullFilePath);
      } catch (error) {
        throw createError(404, 'Receipt file not found on disk');
      }

      // Read file and convert to base64
      const fileBuffer = await fs.readFile(fullFilePath);
      const base64String = fileBuffer.toString('base64');

      // Return data URL format for direct use in img src
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw createError(500, 'Failed to read receipt file');
    }
  }

  /**
   * Reject top-up request
   */
  async rejectTopUpRequest(requestId, adminId, rejectionData) {
    try {
      const { rejectionReason, adminNotes } = rejectionData;

      const request = await ClientTopUpRequest.findByPk(requestId);

      if (!request) {
        throw createError(404, 'Top-up request not found');
      }

      if (request.status !== 'pending') {
        throw createError(400, 'Request has already been processed');
      }

      await request.update({
        status: 'rejected',
        rejectionReason,
        adminNotes,
        processedBy: adminId,
        processedAt: new Date()
      });

      // Send notification to client
      await emailService.sendClientNotification(
        request.clientId,
        'TOPUP_REJECTED',
        {
          requestId,
          rejectionReason,
          adminNotes
        }
      );

      return {
        message: 'Top-up request rejected',
        rejectionReason
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ClientWalletService();
