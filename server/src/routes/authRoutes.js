import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  refreshTokens,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', authMiddleware, getProfile);
router.post('/refresh', authMiddleware, refreshTokens);

export default router;
