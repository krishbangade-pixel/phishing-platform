import { sendError } from '../utils/responseUtils.js';
import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      user: req.user?.id
    },
    'Unhandled application error'
  );

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected error occurred.';

  return sendError(res, errorCode, message, statusCode, err.details);
}

export function notFoundHandler(req, res) {
  return sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found.`, 404);
}
