import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import logger from '../utils/logger.js';

if (!env.SUPABASE_URL || env.SUPABASE_URL.includes('placeholder')) {
  logger.warn('SUPABASE_URL is using default placeholder values. Database persistence will fail until configured in .env');
}

// Supabase client with Service Role Key for backend administration and row saving
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Supabase client with Anonymous Key for public/auth verifications
export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Creates an authenticated Supabase client using the caller's JWT access token
 * @param {string} accessToken
 */
export function getAuthenticatedSupabaseClient(accessToken) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    accessToken: async () => accessToken,
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
