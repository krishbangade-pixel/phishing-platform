import { googleSafeBrowsingConfig } from '../config/securityApis.js';
import logger from '../utils/logger.js';

export async function checkGoogleSafeBrowsing(url) {
  if (!googleSafeBrowsingConfig.enabled) {
    return {
      available: false,
      enabled: false,
      matched: false,
      threats: []
    };
  }

  const endpoint = `${googleSafeBrowsingConfig.endpoint}?key=${googleSafeBrowsingConfig.apiKey}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), googleSafeBrowsingConfig.timeoutMs);

  try {
    const payload = {
      client: {
        clientId: 'ai-phishing-detector-backend',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn(`Google Safe Browsing API returned status ${response.status}`);
      return {
        available: false,
        error: `API HTTP status ${response.status}`,
        matched: false,
        threats: []
      };
    }

    const data = await response.json();
    const matches = data.matches || [];
    const matched = matches.length > 0;

    return {
      available: true,
      enabled: true,
      matched,
      threats: matches.map(m => ({
        threatType: m.threatType,
        platformType: m.platformType
      }))
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const isTimeout = error.name === 'AbortError';
    logger.error({ error: error.message, isTimeout }, 'Google Safe Browsing API lookup failed');

    return {
      available: false,
      error: isTimeout ? 'Request timeout' : error.message,
      matched: false,
      threats: []
    };
  }
}
