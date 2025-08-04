import airtimeService from '../services/airtimeService.js';

class AirtimeController {
  /**
   * Initiate an airtime request
   */
  async initiateAirtime(req, res, next) {
    try {
      console.log(req.body)
      const { phoneNumber, provider, amount } = req.body;

      // Create request context with client info from API key auth
      const requestContext = {
        clientId: req.client?.id || req.user?.id,
        apiKeyId: req.apiKey?.id,
        clientInfo: req.client,
        apiKeyName: req.apiKey?.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };

      // Process the airtime through the service
      const result = await airtimeService.processAirtime(
        { phoneNumber, provider, amount },
        requestContext
      );
      console.log(result)

      // Always return success response format, even for failed transactions
      // This prevents customers from knowing specific error details
      if (result.status === 'success') {
        res.status(200).json({
          success: true,
          message: 'Airtime processed successfully',
          data: result
        });
      } else {
        // For failed transactions, return generic message
        // The actual error details have been emailed to the client
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again later.',
          error: {
            code: 'SERVICE_UNAVAILABLE',
            status: 503
          }
        });
      }
    } catch (error) {
      console.log(error)
      // Any unhandled errors should also return generic response
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }
  }

  /**
   * Check airtime transaction status
   */
  async checkAirtimeStatus(req, res, next) {
    try {
      const { id } = req.params;

      const requestContext = {
        clientId: req.client?.id || req.user?.id,
        apiKeyId: req.apiKey?.id,
      };

      const status = await airtimeService.checkAirtimeStatus(id, requestContext);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      // Return generic error response
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
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
        offset: (parseInt(page) - 1) * (parseInt(limit) || 10)
      });

      res.status(200).json({
        success: true,
        data: {
          data: history,
          pagination: {
            total: history.length,
            currentPage: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            totalPages: Math.ceil(history.length / (parseInt(limit) || 10)),
            hasPrevPage: parseInt(page) > 1,
            hasNextPage: history.length === (parseInt(limit) || 10)
          }
        }
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }
  }
}

const controller = new AirtimeController();

export const {
  initiateAirtime,
  checkAirtimeStatus,
  getAirtimeHistory
} = controller;

export default controller; 