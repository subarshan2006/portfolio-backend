import express from 'express';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
    registerValidator,
    loginValidator,
    changePasswordValidator,
    updateProfileValidator,
    updateSettingsValidator,
} from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, updateProfileValidator, validate, authController.updateProfile);
router.put('/settings', authenticate, updateSettingsValidator, validate, authController.updateSettings);
router.put('/change-password', authenticate, changePasswordValidator, validate, authController.changePassword);

export default router;
