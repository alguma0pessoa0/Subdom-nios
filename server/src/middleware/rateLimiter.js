import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

export const generalLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

export const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    // Free plan: 5 per day
    // Pro/Enterprise: unlimited
    return req.userPlan === 'FREE' ? 5 : 999;
  },
  message: 'Scan limit exceeded for your plan',
  keyGenerator: (req) => req.userId || req.ip,
});

export default { generalLimiter, authLimiter, scanLimiter };
