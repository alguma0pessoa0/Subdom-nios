import express from 'express';
import {
  generateApiKey,
  getApiKeys,
  revokeApiKey,
} from '../controllers/apiKeyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, generateApiKey);
router.get('/', authMiddleware, getApiKeys);
router.delete('/:id', authMiddleware, revokeApiKey);

export default router;
