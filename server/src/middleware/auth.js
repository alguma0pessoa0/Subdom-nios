import express from 'express';
import { verifyToken } from '../utils/jwt.js';

const router = express.Router();

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    req.userId = payload.userId;
    req.email = payload.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API key' });
    }

    // API key validation will be handled in the controller
    req.apiKey = apiKey;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
}

export default router;
