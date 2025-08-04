import clientAuthService from '../services/clientAuthService.js';
import createError from 'http-errors';

/**
 * Middleware to authenticate client JWT tokens
 */
export const authenticateClient = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createError(401, 'Access token is required'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(createError(401, 'Invalid token format'));
    }

    // Verify token and get client data
    const client = await clientAuthService.verifyToken(token);

    // Attach client to request object
    req.client = client;

    next();
  } catch (error) {
    if (error.status === 401) {
      return next(error);
    }
    return next(createError(401, 'Invalid or expired token'));
  }
};

/**
 * Middleware to ensure client has access to their own resources
 * Use this after authenticateClient to verify resource ownership
 */
export const ensureClientOwnership = (resourceIdParam = 'clientId') => {
  return (req, res, next) => {
    const resourceClientId = req.params[resourceIdParam] || req.body[resourceIdParam];

    if (!resourceClientId) {
      return next(createError(400, 'Client ID is required'));
    }

    if (req.client.id !== resourceClientId) {
      return next(createError(403, 'Access denied: You can only access your own resources'));
    }

    next();
  };
};

/**
 * Generic client protection middleware that combines authentication and ownership check
 */
export const protectClient = (resourceIdParam = 'clientId') => {
  return [
    authenticateClient,
    ensureClientOwnership(resourceIdParam)
  ];
};

export default {
  authenticateClient,
  ensureClientOwnership,
  protectClient
};
