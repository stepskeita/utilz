import cashpowerService from '../services/cashpowerService.js';

class CashpowerController {
  /**
   * Initiate a cashpower request
   */
  async initiateCashpower(req, res, next) {
    try {
      console.log(req.body)
      const { meterNumber, amount, phone, provider } = req.body;

      // Create request context with client info from API key auth
      const requestContext = {
        clientId: req.client?.id || req.user?.id,
        apiKeyId: req.apiKey?.id,
        clientInfo: req.client,
        apiKeyName: req.apiKey?.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };

      // Process the cashpower through the service
      const result = await cashpowerService.processCashpower(
        { meterNumber, amount, phone, provider },
        requestContext
      );
      console.log(result)

      // Always return success response format, even for failed transactions
      // This prevents customers from knowing specific error details
      if (result.status === 'success') {
        res.status(200).json({
          success: true,
          message: 'Cashpower processed successfully',
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
   * Check cashpower transaction status
   */
  async checkCashpowerStatus(req, res, next) {
    try {
      const { id } = req.params;

      const requestContext = {
        clientId: req.client?.id || req.user?.id,
        apiKeyId: req.apiKey?.id,
      };

      const status = await cashpowerService.checkCashpowerStatus(id, requestContext);

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
   * Get cashpower transaction history
   */
  async getCashpowerHistory(req, res, next) {
    try {
      const { limit, page } = req.query;

      const history = await cashpowerService.getCashpowerHistory({
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

  /**
   * Check meter with specified provider
   */
  async checkMeter(req, res, next) {
    try {
      const { meterNumber, amount, provider } = req.body;

      const result = await cashpowerService.checkMeter(meterNumber, amount, provider);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Meter check successful',
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Meter check failed',
          error: result.error
        });
      }
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

  /**
   * Reprint cashpower token
   */
  async reprintToken(req, res, next) {
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

const controller = new CashpowerController();

export const {
  initiateCashpower,
  checkCashpowerStatus,
  getCashpowerHistory,
  checkMeter,
  reprintToken
} = controller;

export default controller; 