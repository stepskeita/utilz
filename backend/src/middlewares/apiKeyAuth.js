import { ApiKey, Client, ApiUsage } from '../models/index.js';
import createError from 'http-errors';
import emailService from '../services/emailService.js';

export const apiKeyAuth = async (req, res, next) => {
  try {
    // Get API key from header or query parameter
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    // Find API key in database
    const keyRecord = await ApiKey.findOne({
      where: { key: apiKey },
      include: [{
        model: Client,
        attributes: ['id', 'name', 'isActive', 'plan', 'monthlyQuota', 'email', 'contactPerson'],
      }]
    });

    if (!keyRecord) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    // Explicit check for client status (additional safety check)
    if (!keyRecord.Client.isActive) {
      // Send email notification about inactive client (fire-and-forget)
      emailService.sendClientErrorNotification(
        keyRecord.Client,
        'ACCOUNT_INACTIVE',
        'Client account is inactive',
        {
          endpoint: req.originalUrl,
          method: req.method,
          ipAddress: req.ip || req.connection.remoteAddress,
          apiKeyName: keyRecord.name
        }
      ).catch(() => { }); // Silent fail - don't block the response

      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    // Check if key has expired
    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      // Send email notification about expired API key (fire-and-forget)
      emailService.sendClientErrorNotification(
        keyRecord.Client,
        'API_KEY_EXPIRED',
        'API Key has expired',
        {
          endpoint: req.originalUrl,
          method: req.method,
          ipAddress: req.ip || req.connection.remoteAddress,
          apiKeyName: keyRecord.name
        }
      ).catch(() => { }); // Silent fail - don't block the response

      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    // Service subscription validation
    const isAirtimeRoute = req.originalUrl.includes('/utility/airtime');
    const isCashpowerRoute = req.originalUrl.includes('/utility/cashpower');

    if (isAirtimeRoute && !keyRecord.isAirtime && !keyRecord.isBoth) {
      // Send email notification about unauthorized airtime access (fire-and-forget)
      emailService.sendClientErrorNotification(
        keyRecord.Client,
        'UNAUTHORIZED_AIRTIME_ACCESS',
        'Attempted to access airtime services without subscription',
        {
          endpoint: req.originalUrl,
          method: req.method,
          ipAddress: req.ip || req.connection.remoteAddress,
          apiKeyName: keyRecord.name
        }
      ).catch(() => { }); // Silent fail - don't block the response

      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    if (isCashpowerRoute && !keyRecord.isCashpower && !keyRecord.isBoth) {
      // Send email notification about unauthorized cashpower access (fire-and-forget)
      emailService.sendClientErrorNotification(
        keyRecord.Client,
        'UNAUTHORIZED_CASHPOWER_ACCESS',
        'Attempted to access electricity token services without subscription',
        {
          endpoint: req.originalUrl,
          method: req.method,
          ipAddress: req.ip || req.connection.remoteAddress,
          apiKeyName: keyRecord.name
        }
      ).catch(() => { }); // Silent fail - don't block the response

      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: {
          code: 'SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    }

    // Check IP restrictions if any
    // if (keyRecord.ipRestrictions && keyRecord.ipRestrictions.length > 0) {
    //   const clientIp = req.ip || req.connection.remoteAddress;

    //   if (!keyRecord.ipRestrictions.includes(clientIp)) {
    //     // Send email notification about IP restriction violation (fire-and-forget)
    //     emailService.sendClientErrorNotification(
    //       keyRecord.Client,
    //       'IP_RESTRICTION_VIOLATION',
    //       `API access attempted from unauthorized IP address: ${clientIp}`,
    //       {
    //         endpoint: req.originalUrl,
    //         method: req.method,
    //         ipAddress: clientIp,
    //         apiKeyName: keyRecord.name,
    //         authorizedIPs: keyRecord.ipRestrictions
    //       }
    //     ).catch(() => { }); // Silent fail - don't block the response

    //     return res.status(503).json({
    //       success: false,
    //       message: 'Service temporarily unavailable. Please try again later.',
    //       error: {
    //         code: 'SERVICE_UNAVAILABLE',
    //         status: 503
    //       }
    //     });
    //   }
    // }

    // Store client and key info in request object for later use
    req.client = keyRecord.Client;
    req.apiKey = {
      id: keyRecord.id,
      name: keyRecord.name,
      isAirtime: keyRecord.isAirtime,
      isCashpower: keyRecord.isCashpower,
      isBoth: keyRecord.isBoth
    };

    // Update last used timestamp (do this asynchronously to not block the request)
    ApiKey.update(
      { lastUsedAt: new Date() },
      { where: { id: keyRecord.id } }
    ).catch(err => console.error('Failed to update API key last used timestamp:', err));

    // Create a hook to track API usage after the request completes
    const startTime = Date.now();
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;

      // Log API usage asynchronously
      ApiUsage.create({
        apiKeyId: keyRecord.id,
        clientId: keyRecord.Client.id,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        responseTime,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        requestPayload: req.method !== 'GET' ? req.body : null,
        transactionAmount: req.body?.amount // Assuming amount is in the request body for utility requests
      }).catch(err => console.error('Failed to log API usage:', err));
    });

    next();
  } catch (error) {
    console.error('API Key auth error:', error);

    // Send generic error response
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again later.',
      error: {
        code: 'SERVICE_UNAVAILABLE',
        status: 503
      }
    });
  }
};

export default apiKeyAuth;