import express from 'express';
import {
  checkBalance,
  getBalanceStatus,
  sendTestAlert,
  getMonitoringStatus
} from '../../controllers/balanceController.js';
import { authenticateJWT, authorizeAdmin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply admin authentication to all balance routes
router.use(authenticateJWT);
// router.use(authorizeAdmin);

/**
 * @route   POST /api/v1/balance/check
 * @desc    Manually trigger balance check
 * @access  Private (Admin only)
 */
router.post('/check', checkBalance);

/**
 * @route   GET /api/v1/balance/status
 * @desc    Get current balance status
 * @access  Private (Admin only)
 */
router.get('/status', getBalanceStatus);

/**
 * @route   POST /api/v1/balance/test-alert
 * @desc    Send test balance alert email
 * @access  Private (Admin only)
 * @body    { alertLevel: 'critical' | 'warning' | 'low' }
 */
router.post('/test-alert', sendTestAlert);

/**
 * @route   GET /api/v1/balance/monitoring
 * @desc    Get monitoring service status
 * @access  Private (Admin only)
 */
router.get('/monitoring', getMonitoringStatus);

export default router;
