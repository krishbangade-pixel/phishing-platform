import { supabaseAdmin, supabaseAnon } from '../config/supabase.js';
import { sendError } from '../utils/responseUtils.js';
import logger from '../utils/logger.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Support test mode authentication mock when running automated vitest tests
  if (process.env.NODE_ENV === 'test' && req.headers['x-test-user-id']) {
    req.user = {
      id: req.headers['x-test-user-id'],
      email: 'testuser@example.com'
    };
    req.token = 'test-token-mock';
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'UNAUTHORIZED', 'Authentication required. Authorization header missing or malformed.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return sendError(res, 'UNAUTHORIZED', 'Authentication required. Access token is empty.', 401);
  }

  try {
    // Validate token with Supabase Auth
    const { data, error } = await supabaseAnon.auth.getUser(token);

    if (error || !data?.user) {
      logger.debug({ error: error?.message }, 'Invalid or expired Supabase access token');
      return sendError(res, 'UNAUTHORIZED', 'Invalid or expired authentication token.', 401);
    }

    // Attach authenticated user details and bearer token to request
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role
    };
    req.token = token;

    logger.debug({ userId: data.user.id }, 'Supabase user session authenticated successfully');
    return next();
  } catch (err) {
    logger.error({ error: err.message }, 'Unexpected error during token authentication');
    return sendError(res, 'UNAUTHORIZED', 'Authentication failed.', 401);
  }
}
