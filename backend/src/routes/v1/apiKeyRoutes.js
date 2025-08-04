import express from "express";
import {
  getAllApiKeys,
  getApiKeyById,
  createApiKey,
  updateApiKey,
  revokeApiKey,
  getClientApiKeys,
  getApiKeyStats,
  getClientActiveApiKeys
} from "../../controllers/apiKeyController.js";
import requestValidator from "../../middlewares/requestValidator.js";
import {
  createApiKeySchema,
  updateApiKeySchema
} from "../../utils/validations/apiKeyValidators.js";
import { authenticateJWT, authorizeAdmin } from "../../middlewares/authMiddleware.js";
import { authenticateClient } from "../../middlewares/clientAuthMiddleware.js";

/**
 * Router for API key management endpoints
 * All endpoints require admin authentication
 */
const router = express.Router();



// API key management routes
router.get('/client/:clientId', authenticateClient, getClientActiveApiKeys);
router.use(authenticateJWT, authorizeAdmin);
router.get('/', getAllApiKeys);
router.get('/admin/:clientId', getClientApiKeys);
router.get('/:id', getApiKeyById);
router.get('/:id/stats', getApiKeyStats);
router.post('/client/:clientId', requestValidator(createApiKeySchema), createApiKey);
router.put('/:id', requestValidator(updateApiKeySchema), updateApiKey);
router.delete('/:id', revokeApiKey);

export default router;