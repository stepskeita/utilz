import createError from 'http-errors';
import { ClientWallet, WalletTransaction, UtilityTransaction, Client, sequelize } from '../models/index.js';
import emailService from './emailService.js';
import moment from 'moment';

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
}

export default new ClientWalletService();
