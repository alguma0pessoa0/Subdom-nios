import express from 'express';
import {
  createScan,
  getScan,
  getScanHistory,
  exportScan,
} from '../controllers/scanController.js';
import { authMiddleware, apiKeyMiddleware } from '../middleware/auth.js';
import { validateApiKey } from '../controllers/apiKeyController.js';
import { scanLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Middleware to check both JWT and API Key
async function scanAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  if (!authHeader && !apiKey) {
    return res.status(401).json({ error: 'Missing authentication' });
  }

  if (authHeader) {
    authMiddleware(req, res, next);
  } else if (apiKey) {
    const userId = await validateApiKey(apiKey);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.userId = userId;
    next();
  }
}

router.post('/', scanAuthMiddleware, scanLimiter, createScan);
router.get('/:id', scanAuthMiddleware, getScan);
router.get('/', scanAuthMiddleware, getScanHistory);
router.get('/:id/export', scanAuthMiddleware, exportScan);

export default router;
