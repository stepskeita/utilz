import airtimeService from '../services/airtimeService.js';
import cashpowerService from '../services/cashpowerService.js';

class UtilityController {
    /**
     * Initiate an airtime request
     */
    async initiateAirtime(req, res, next) {
        try {
            console.log(req.body)
            const { phoneNumber, provider, amount } = req.body;

            // Get client and API key info from middleware
            const requestContext = {
                clientId: req.client.id,
                apiKeyId: req.apiKey.id,
                clientInfo: req.client,
                ipAddress: req.ip || req.connection.remoteAddress,
                apiKeyName: req.apiKey.name
            };

            // Process the airtime through the service
            const result = await airtimeService.processAirtime(
                { phoneNumber, provider, amount },
                requestContext
            );

            res.status(200).json({
                success: true,
                message: 'Airtime processed successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check airtime transaction status
     */
    async checkAirtimeStatus(req, res, next) {
        try {
            const { id } = req.params;

            const requestContext = {
                clientId: req.client.id
            };

            const status = await airtimeService.checkAirtimeStatus(id, requestContext);

            res.status(200).json({
                success: true,
                message: 'Airtime status retrieved successfully',
                data: status
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get airtime transaction history
     */
    async getAirtimeHistory(req, res, next) {
        try {
            const { limit, page } = req.query;

            const history = await airtimeService.getAirtimeHistory({
                ...req.query,
                limit: parseInt(limit) || 10,
                offset: parseInt(page) ? (parseInt(page) - 1) * (parseInt(limit) || 10) : 0
            });

            res.status(200).json({
                success: true,
                message: 'Airtime history retrieved successfully',
                data: history
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Initiate a cashpower request
     */
    async initiateCashpower(req, res, next) {
        try {
            console.log(req.body)
            const { meterNumber, amount, phone, provider } = req.body;

            // Get client and API key info from middleware
            const requestContext = {
                clientId: req.client.id,
                apiKeyId: req.apiKey.id,
                clientInfo: req.client,
                ipAddress: req.ip || req.connection.remoteAddress,
                apiKeyName: req.apiKey.name
            };

            // Process the cashpower through the service
            const result = await cashpowerService.processCashpower(
                { meterNumber, amount, phone, provider },
                requestContext
            );

            res.status(200).json({
                success: true,
                message: 'Cashpower processed successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check cashpower transaction status
     */
    async checkCashpowerStatus(req, res, next) {
        try {
            const { id } = req.params;

            const requestContext = {
                clientId: req.client.id
            };

            const status = await cashpowerService.checkCashpowerStatus(id, requestContext);

            res.status(200).json({
                success: true,
                message: 'Cashpower status retrieved successfully',
                data: status
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get cashpower transaction history
     */
    async getCashpowerHistory(req, res, next) {
        try {
            const { limit, page } = req.query;

            const history = await cashpowerService.getCashpowerHistory({
                ...req.query,
                limit: parseInt(limit) || 10,
                offset: parseInt(page) ? (parseInt(page) - 1) * (parseInt(limit) || 10) : 0
            });

            res.status(200).json({
                success: true,
                message: 'Cashpower history retrieved successfully',
                data: history
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reprint cashpower token
     */
    async reprintCashpowerToken(req, res, next) {
        try {
            const { meterNumber, phone, provider } = req.body;

            const result = await cashpowerService.reprintToken(meterNumber, phone, provider);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Token reprinted successfully',
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Token reprint failed',
                    error: result.error
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

const controller = new UtilityController();

export const {
    initiateAirtime,
    checkAirtimeStatus,
    getAirtimeHistory,
    initiateCashpower,
    checkCashpowerStatus,
    getCashpowerHistory,
    reprintCashpowerToken
} = controller;

export default controller;