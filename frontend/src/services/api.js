import { supabase, isSupabaseConfigured } from './supabase.js';
import { INITIAL_MOCK_SCANS } from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

// In-memory local fallback store when backend is offline
let localMockScans = [...INITIAL_MOCK_SCANS];

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

  try {
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
  } catch (err) {
    // If backend server is un-reachable (NetworkError / FetchError) and mock fallback is enabled
    if (ENABLE_MOCK_FALLBACK && (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.code === 'ECONNREFUSED')) {
      console.info(`[API Service] Express backend unreachable at ${url}. Falling back to local interactive mock layer.`);
      return handleMockFallback(endpoint, options);
    }
    throw err;
  }
}

/**
 * Local mock fallback handler when backend is offline
 */
function handleMockFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. URL Scan
  if (endpoint === '/api/scans/url' && method === 'POST') {
    const { url } = body;
    const isPhish = /login|verify|bank|secure|update|paypal|chase|account|free|prize/i.test(url);
    const mockScan = {
      id: `scan-url-${Date.now()}`,
      scan_type: 'url',
      target: url,
      normalized_target: url.replace(/^https?:\/\//i, ''),
      risk_score: isPhish ? 85 : 8,
      risk_level: isPhish ? 'High' : 'Low',
      status: isPhish ? 'Suspicious' : 'Safe',
      findings: isPhish ? [
        {
          rule: 'SUSPICIOUS_KEYWORD_MATCH',
          title: 'Suspicious Domain Keywords',
          severity: 'high',
          description: 'URL contains high-risk keywords commonly seen in phish traps.',
          weight: 45
        }
      ] : [],
      recommendation: isPhish 
        ? 'Exercise extreme caution. Do not input credentials on this website.'
        : 'No known security risks detected for this target URL.',
      api_results: {
        googleSafeBrowsing: { listed: isPhish },
        virusTotal: { detectedCount: isPhish ? 5 : 0, totalEngineCount: 90, status: isPhish ? 'SUSPICIOUS' : 'CLEAN' }
      },
      metadata: { protocol: url.startsWith('https') ? 'https:' : 'http:' },
      created_at: new Date().toISOString()
    };
    localMockScans.unshift(mockScan);
    return Promise.resolve({ success: true, data: mockScan, message: 'URL scan completed (Mock mode).' });
  }

  // 2. Email Scan
  if (endpoint === '/api/scans/email' && method === 'POST') {
    const { subject, content, sender } = body;
    const isUrgent = /urgent|verify|suspend|locked|confirm|account|bank/i.test(`${subject} ${content}`);
    const mockScan = {
      id: `scan-email-${Date.now()}`,
      scan_type: 'email',
      target: `Subject: ${subject}`,
      normalized_target: subject,
      risk_score: isUrgent ? 89 : 14,
      risk_level: isUrgent ? 'High' : 'Low',
      status: isUrgent ? 'Malicious' : 'Safe',
      findings: isUrgent ? [
        {
          rule: 'URGENCY_MANIPULATION',
          title: 'Urgency & Fear Manipulation',
          severity: 'high',
          description: 'Email demands immediate action to avoid account suspension.',
          weight: 40
        }
      ] : [],
      recommendation: isUrgent 
        ? 'Do not reply or click any links inside this email.'
        : 'Email analysis completed. No suspicious patterns detected.',
      api_results: { googleSafeBrowsing: { listed: false }, virusTotal: { detectedCount: 0 } },
      metadata: { sender: sender || 'Unknown', extractedUrls: [] },
      created_at: new Date().toISOString()
    };
    localMockScans.unshift(mockScan);
    return Promise.resolve({ success: true, data: mockScan, message: 'Email scan completed (Mock mode).' });
  }

  // 3. Message Scan
  if (endpoint === '/api/scans/message' && method === 'POST') {
    const { content } = body;
    const isScam = /won|prize|claim|gift|urgent|click|http/i.test(content);
    const mockScan = {
      id: `scan-msg-${Date.now()}`,
      scan_type: 'message',
      target: content,
      normalized_target: content.substring(0, 40),
      risk_score: isScam ? 75 : 10,
      risk_level: isScam ? 'High' : 'Low',
      status: isScam ? 'Suspicious' : 'Safe',
      findings: isScam ? [
        {
          rule: 'SMISHING_SCAM_PATTERN',
          title: 'Prize / Smishing Bait Pattern',
          severity: 'medium',
          description: 'Message promises financial reward or urgent delivery action.',
          weight: 35
        }
      ] : [],
      recommendation: isScam 
        ? 'Do not click links or reply to suspicious messages.'
        : 'No obvious smishing patterns detected.',
      api_results: { googleSafeBrowsing: { listed: false } },
      metadata: { extractedUrls: [] },
      created_at: new Date().toISOString()
    };
    localMockScans.unshift(mockScan);
    return Promise.resolve({ success: true, data: mockScan, message: 'Message scan completed (Mock mode).' });
  }

  // 4. Get History / Scans
  if (endpoint.startsWith('/api/scans?') || endpoint === '/api/scans') {
    const urlObj = new URL(`http://localhost${endpoint}`);
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);
    const type = urlObj.searchParams.get('type');
    const riskLevel = urlObj.searchParams.get('risk_level');
    const status = urlObj.searchParams.get('status');
    const search = urlObj.searchParams.get('search')?.toLowerCase();

    let filtered = [...localMockScans];

    if (type) {
      filtered = filtered.filter(s => s.scan_type === type);
    }
    if (riskLevel) {
      filtered = filtered.filter(s => (s.risk_level || '').toLowerCase() === riskLevel.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter(s => (s.status || '').toLowerCase() === status.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(s => 
        (s.target || '').toLowerCase().includes(search) || 
        (s.normalized_target || '').toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return Promise.resolve({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      }
    });
  }

  // 5. Get Individual Scan Report by ID
  const getByIdMatch = endpoint.match(/\/api\/scans\/([a-zA-Z0-9_-]+)$/);
  if (getByIdMatch && method === 'GET') {
    const scanId = getByIdMatch[1];
    const scan = localMockScans.find(s => s.id === scanId);
    if (!scan) {
      const err = new Error('Scan report not found in local mock data.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return Promise.reject(err);
    }
    return Promise.resolve({ success: true, data: scan });
  }

  // 6. Delete Scan Record by ID
  if (getByIdMatch && method === 'DELETE') {
    const scanId = getByIdMatch[1];
    localMockScans = localMockScans.filter(s => s.id !== scanId);
    return Promise.resolve({ success: true, message: 'Scan record deleted successfully (Mock mode).' });
  }

  // Default fallback
  return Promise.resolve({ success: true, data: null });
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
