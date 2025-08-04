import express from 'express';
import { checkBalance } from '../../controllers/gamSwitchController.js';
import { authenticateJWT } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware
router.use(authenticateJWT);

// GamSwitch routes
router.get('/balance', checkBalance);

export default router;
