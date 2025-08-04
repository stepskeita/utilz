import createError from 'http-errors';
import { UtilityTransaction, sequelize, Op } from '../models/index.js';
import { deductFunds } from './walletService.js';
import gamSwitchService from './gamSwitchService.js';
import emailService from './emailService.js';

class UtilityService {

    async processAirtime(airtimeData, requestContext) {
        const { phoneNumber, provider, amount } = airtimeData;
        const { clientId, apiKeyId, clientInfo, ipAddress } = requestContext;

        const transactionReference = this.generateReference();
        let status, providerReference, errorMessage = null;

        try {
            // Step 1: Call GamSwitch API first
            const gamSwitchResult = await gamSwitchService.purchaseAirtime({
                provider: provider.toLowerCase(),
                phoneNumber,
                amount: gamSwitchService.convertToMinorUnits(amount)
            });

            if (gamSwitchResult.success) {
                // Step 2: GamSwitch successful - deduct funds
                const transaction = await sequelize.transaction();

                try {
                    await deductFunds(
                        clientId,
                        null,
                        amount,
                        `Mobile airtime for ${phoneNumber} on ${provider}`,
                        transaction
                    );

                    await transaction.commit();
                    status = 'success';
                    providerReference = gamSwitchResult.data?.id || gamSwitchResult.data?.airtime?.id || 'N/A';
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

                    // Send email notification to client (fire-and-forget)
                    emailService.sendClientErrorNotification(
                        clientInfo,
                        errorType,
                        actualError,
                        {
                            endpoint: '/api/v1/utility/airtime',
                            method: 'POST',
                            ipAddress,
                            apiKeyName: requestContext.apiKeyName,
                            amount: amount,
                            phoneNumber: phoneNumber,
                            provider: provider
                        }
                    ).catch(() => { }); // Silent fail - don't slow down response
                }
            } else {
                // Step 2: GamSwitch failed - no fund deduction
                status = 'fail';
                errorMessage = 'Provider transaction failed';

                // Send email notification for provider errors (fire-and-forget)
                emailService.sendClientErrorNotification(
                    clientInfo,
                    'PROVIDER_ERROR',
                    gamSwitchResult.data?.responseDescription || 'GamSwitch API call failed',
                    {
                        endpoint: '/api/v1/utility/airtime',
                        method: 'POST',
                        ipAddress,
                        apiKeyName: requestContext.apiKeyName,
                        amount: amount,
                        phoneNumber: phoneNumber,
                        provider: provider
                    }
                ).catch(() => { }); // Silent fail - don't slow down response
            }

        } catch (error) {
            status = 'fail';
            errorMessage = 'Transaction processing failed';

            // Send email notification for service errors (fire-and-forget)
            emailService.sendClientErrorNotification(
                clientInfo,
                'SERVICE_ERROR',
                error.message || 'Unknown service error',
                {
                    endpoint: '/api/v1/utility/airtime',
                    method: 'POST',
                    ipAddress,
                    apiKeyName: requestContext.apiKeyName,
                    amount: amount,
                    phoneNumber: phoneNumber,
                    provider: provider
                }
            ).catch(() => { }); // Silent fail - don't slow down response
        }


        // Step 3: Save transaction record with final status
        const utilityTransaction = await UtilityTransaction.create({
            clientId,
            apiKeyId,
            networkCode: provider.toLowerCase(),
            phoneNumber,
            amount,
            transactionReference,
            status,
            providerReference,
            errorMessage,
            completedAt: new Date(),
            metaData: {
                ipAddress
            }
        });

        return {
            reference: transactionReference,
            provider: provider.toLowerCase(),
            status,
            createdAt: utilityTransaction.createdAt,
            completedAt: utilityTransaction.completedAt
        };
    }




    async checkAirtimeStatus(transactionId, context) {
        const transaction = await UtilityTransaction.findByPk(transactionId);

        if (!transaction) {
            throw createError(404, 'Transaction not found');
        }

        if (transaction.clientId !== context.clientId) {
            throw createError(403, 'Access denied to this transaction');
        }

        return {
            transactionId: transaction.id,
            reference: transaction.transactionReference,
            providerReference: transaction.providerReference,
            status: transaction.status,
            amount: transaction.amount,
            phoneNumber: transaction.phoneNumber,
            provider: transaction.networkCode,
            createdAt: transaction.createdAt,
            completedAt: transaction.completedAt,
            errorMessage: transaction.errorMessage
        };
    }


    async getAirtimeHistory(filters = {},) {
        const whereClause = {};

        if (filters.clientId) {
            whereClause.clientId = filters.clientId;
        }
        if (filters.amount) {
            whereClause.amount = filters.amount;
        }
        if (filters.phoneNumber) {
            whereClause.phoneNumber = {
                [Op.like]: `%${filters.phoneNumber}%`
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
     * Generate a unique transaction reference
     * @returns {string} Unique reference string
     */
    generateReference() {
        return `ITOPUP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
}

export default new UtilityService();











