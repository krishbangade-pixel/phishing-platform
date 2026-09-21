import { supabase, isSupabaseConfigured } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Helper to get current Supabase Access Token
 */
async function getAuthToken() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (err) {
    console.warn('Could not retrieve Supabase session token:', err.message);
    return null;
  }
}

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}) {
  const token = await getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorObj = new Error(data.error?.message || data.message || `Request failed with status ${response.status}`);
    errorObj.statusCode = response.status;
    errorObj.code = data.error?.code || 'API_ERROR';
    errorObj.details = data.error?.details || null;
    throw errorObj;
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
