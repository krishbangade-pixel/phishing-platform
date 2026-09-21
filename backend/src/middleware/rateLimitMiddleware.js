import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { sendError } from '../utils/responseUtils.js';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, 'TOO_MANY_REQUESTS', 'Too many requests, please try again later.', 429);
  }
});

export const urlScanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.URL_SCAN_RATE_LIMIT || 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, 'RATE_LIMIT_EXCEEDED', 'URL scan rate limit exceeded. Please wait before submitting more URLs.', 429);
  }
});

export const emailScanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.EMAIL_SCAN_RATE_LIMIT || 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, 'RATE_LIMIT_EXCEEDED', 'Email scan rate limit exceeded. Please wait before submitting more content.', 429);
  }
});
