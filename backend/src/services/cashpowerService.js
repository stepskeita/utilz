import createError from 'http-errors';
import { UtilityTransaction, sequelize, Op } from '../models/index.js';
import { deductFunds } from './walletService.js';
import cashpowerGamSwitchService from './cashpowerGamSwitchService.js';
import cashpowerNawecService from './cashpowerNawecService.js';
import emailService from './emailService.js';

class CashpowerService {
  constructor() {
    // Determine default provider from environment
    this.defaultProvider = process.env.DEFAULT_CASHPOWER_PROVIDER || 'gamswitch';
  }

  /**
   * Process cashpower purchase
   */
  async processCashpower(cashpowerData, requestContext) {
    const { meterNumber, amount, phone, provider } = cashpowerData;
    const { clientId, apiKeyId, clientInfo, ipAddress } = requestContext;

    // Determine which provider to use
    const selectedProvider = provider || this.defaultProvider;

    const transactionReference = this.generateReference();
    let status, providerReference, errorMessage = null;
    let tokenData = null;

    try {
      // Step 1: Check meter first
      const meterCheckResult = await this.checkMeter(meterNumber, amount, selectedProvider);

      if (!meterCheckResult.success) {
        status = 'fail';
        errorMessage = 'Meter validation failed';

        // Send email notification for meter check errors
        emailService.sendClientErrorNotification(
          clientInfo,
          'METER_VALIDATION_ERROR',
          meterCheckResult.error || 'Meter validation failed',
          {
            endpoint: '/api/v1/utility/cashpower',
            method: 'POST',
            ipAddress,
            apiKeyName: requestContext.apiKeyName,
            amount: amount,
            meterNumber: meterNumber,
            provider: selectedProvider
          }
        ).catch(() => { });

        // Save failed transaction
        await this.saveTransaction({
          clientId,
          apiKeyId,
          meterNumber,
          amount,
          transactionReference,
          status,
          providerReference,
          errorMessage,
          ipAddress,
          provider: selectedProvider
        });

        return {
          reference: transactionReference,
          provider: selectedProvider,
          status,
          createdAt: new Date(),
          completedAt: new Date()
        };
      }

      // Step 2: Purchase cashpower
      const purchaseResult = await this.purchaseCashpower(meterNumber, amount, phone, selectedProvider);

      if (purchaseResult.success) {
        // Step 3: Purchase successful - deduct funds
        const transaction = await sequelize.transaction();

        try {
          await deductFunds(
            clientId,
            null,
            amount,
            `Electricity token for meter ${meterNumber} via ${selectedProvider}`,
            transaction
          );

          await transaction.commit();
          status = 'success';
          providerReference = purchaseResult.data?.transactionId || purchaseResult.data?.id || 'N/A';
          tokenData = purchaseResult.data?.token || purchaseResult.data?.units;

        } catch (deductError) {
          await transaction.rollback();
          status = 'fail';

          // Determine error type for email notification
          let errorType = 'WALLET_ERROR';
          let actualError = deductError.message;

          if (deductError.message.includes('Insufficient wallet balance')) {
            errorType = 'INSUFFICIENT_BALANCE';
          } else if (deductError.message.includes('active')) {
            errorType = 'ACCOUNT_INACTIVE';
          }

          errorMessage = 'Transaction processing failed';

          // Send email notification to client
          emailService.sendClientErrorNotification(
            clientInfo,
            errorType,
            actualError,
            {
              endpoint: '/api/v1/utility/cashpower',
              method: 'POST',
              ipAddress,
              apiKeyName: requestContext.apiKeyName,
              amount: amount,
              meterNumber: meterNumber,
              provider: selectedProvider
            }
          ).catch(() => { });
        }
      } else {
        // Step 3: Purchase failed - no fund deduction
        status = 'fail';
        errorMessage = 'Provider transaction failed';

        // Send email notification for provider errors
        emailService.sendClientErrorNotification(
          clientInfo,
          'PROVIDER_ERROR',
          purchaseResult.error || 'Cashpower purchase failed',
          {
            endpoint: '/api/v1/utility/cashpower',
            method: 'POST',
            ipAddress,
            apiKeyName: requestContext.apiKeyName,
            amount: amount,
            meterNumber: meterNumber,
            provider: selectedProvider
          }
        ).catch(() => { });
      }

    } catch (error) {
      status = 'fail';
      errorMessage = 'Transaction processing failed';

      // Send email notification for service errors
      emailService.sendClientErrorNotification(
        clientInfo,
        'SERVICE_ERROR',
        error.message || 'Unknown service error',
        {
          endpoint: '/api/v1/utility/cashpower',
          method: 'POST',
          ipAddress,
          apiKeyName: requestContext.apiKeyName,
          amount: amount,
          meterNumber: meterNumber,
          provider: selectedProvider
        }
      ).catch(() => { });
    }

    // Step 4: Save transaction record with final status
    const utilityTransaction = await this.saveTransaction({
      clientId,
      apiKeyId,
      meterNumber,
      amount,
      transactionReference,
      status,
      providerReference,
      errorMessage,
      ipAddress,
      provider: selectedProvider,
      tokenData
    });

    return {
      reference: transactionReference,
      provider: selectedProvider,
      status,
      createdAt: utilityTransaction.createdAt,
      completedAt: utilityTransaction.completedAt,
      tokenData: tokenData
    };
  }

  /**
   * Check meter with specified provider
   */
  async checkMeter(meterNumber, amount, provider) {
    try {
      if (provider === 'gamswitch') {
        return await cashpowerGamSwitchService.checkMeter({ meterNumber, amount });
      } else if (provider === 'nawec') {
        return await cashpowerNawecService.checkMeter({ meterNumber, amount });
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Purchase cashpower with specified provider
   */
  async purchaseCashpower(meterNumber, amount, phone, provider) {
    try {
      if (provider === 'gamswitch') {
        return await cashpowerGamSwitchService.vendCashpower({ meterNumber, phone, amount });
      } else if (provider === 'nawec') {
        return await cashpowerNawecService.buyPower({ meterNumber, phone, amount });
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save transaction to database
   */
  async saveTransaction(transactionData) {
    const {
      clientId,
      apiKeyId,
      meterNumber,
      amount,
      transactionReference,
      status,
      providerReference,
      errorMessage,
      ipAddress,
      provider,
      tokenData
    } = transactionData;

    return await UtilityTransaction.create({
      clientId,
      apiKeyId,
      type: 'cashpower',
      networkCode: provider,
      meterNumber,
      amount,
      transactionReference,
      status,
      providerReference,
      errorMessage,
      completedAt: new Date(),
      metaData: {
        ipAddress,
        tokenData,
        provider
      }
    });
  }

  /**
   * Check cashpower transaction status
   */
  async checkCashpowerStatus(transactionId, context) {
    const transaction = await UtilityTransaction.findByPk(transactionId);

    if (!transaction) {
      throw createError(404, 'Transaction not found');
    }

    if (transaction.clientId !== context.clientId) {
      throw createError(403, 'Access denied to this transaction');
    }

    if (transaction.type !== 'cashpower') {
      throw createError(400, 'Invalid transaction type');
    }

    return {
      transactionId: transaction.id,
      reference: transaction.transactionReference,
      providerReference: transaction.providerReference,
      status: transaction.status,
      amount: transaction.amount,
      meterNumber: transaction.meterNumber,
      provider: transaction.networkCode,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt,
      errorMessage: transaction.errorMessage,
      tokenData: transaction.metaData?.tokenData
    };
  }

  /**
   * Get cashpower transaction history
   */
  async getCashpowerHistory(filters = {}) {
    const whereClause = {
      type: 'cashpower' // Only cashpower transactions
    };

    if (filters.clientId) {
      whereClause.clientId = filters.clientId;
    }
    if (filters.amount) {
      whereClause.amount = filters.amount;
    }
    if (filters.meterNumber) {
      whereClause.meterNumber = {
        [Op.like]: `%${filters.meterNumber}%`
      };
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.provider) {
      whereClause.networkCode = filters.provider;
    }

    if (filters.startDate && filters.endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
      };
    }

    return await UtilityTransaction.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: filters.limit || 100,
      offset: filters.offset || 0,
      include: [{
        model: sequelize.models.Client,
        attributes: ['id', 'name', 'email']
      }]
    });
  }

  /**
   * Reprint token
   */
  async reprintToken(meterNumber, phone, provider) {
    try {
      if (provider === 'gamswitch') {
        return await cashpowerGamSwitchService.reprintToken({ meterNumber, phone });
      } else if (provider === 'nawec') {
        return await cashpowerNawecService.getTransaction(meterNumber);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate a unique transaction reference
   * @returns {string} Unique reference string
   */
  generateReference() {
    return `ICASHPOWER${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }
}

export default new CashpowerService(); 