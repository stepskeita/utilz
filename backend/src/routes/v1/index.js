import express from 'express';
import airtimeRoutes from './airtimeRoutes.js';
import cashpowerRoutes from './cashpowerRoutes.js';
import clientRoutes from './clientRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// ==================== SERVICE ROUTES ====================

/**
 * Airtime Service Routes
 * All routes require API key with airtime access
 */
router.use('/airtime', airtimeRoutes);

/**
 * Cashpower Service Routes
 * All routes require API key with cashpower access
 */
router.use('/cashpower', cashpowerRoutes);

// ==================== CLIENT ROUTES ====================

/**
 * Client Routes
 * Authentication, profile, wallet, and API key management
 */
router.use('/client', clientRoutes);

// ==================== ADMIN ROUTES ====================

/**
 * Admin Routes
 * System management, client management, analytics
 */
router.use('/admin', adminRoutes);

export default router;