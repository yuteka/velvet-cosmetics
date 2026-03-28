import rateLimit from 'express-rate-limit';
import redisClient from '../config/redis.js';

// 🔐 Login Rate Limiter — 5 attempts only
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts
  message: {
    error: '❌ Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    const ip = req.ip;
    await redisClient.setEx(
      `blocked:${ip}`,
      15 * 60, // 15 minutes block
      'blocked'
    );
    res.status(429).json(options.message);
  },
});

// 🛡️ General API Limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // 100 requests
  message: {
    error: '❌ Too many requests. Please slow down!'
  },
});