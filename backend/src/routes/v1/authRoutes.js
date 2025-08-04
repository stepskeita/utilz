import express from 'express';
import { login, register, refreshToken } from '../../controllers/authController.js';
import requestValidator from '../../middlewares/requestValidator.js';
import { loginSchema, refreshTokenSchema, registerSchema } from '../../utils/validations/authValidators.js';

const router = express.Router();

// Authentication routes with validation
router.post('/login', requestValidator(loginSchema), login);
router.post('/register', requestValidator(registerSchema), register);
router.post('/refresh-token', requestValidator(refreshTokenSchema), refreshToken);

export default router;