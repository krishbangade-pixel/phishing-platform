import { virusTotalConfig } from '../config/securityApis.js';
import logger from '../utils/logger.js';

/**
 * Converts a URL into a base64url encoded identifier for VirusTotal API v3
 */
function getUrlId(url) {
  const base64 = Buffer.from(url).toString('base64');
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export async function checkVirusTotal(url) {
  if (!virusTotalConfig.enabled) {
    return {
      available: false,
      enabled: false,
      matched: false,
      maliciousCount: 0,
      stats: null
    };
  }

  const urlId = getUrlId(url);
  const endpoint = `${virusTotalConfig.endpoint}/${urlId}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), virusTotalConfig.timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'x-apikey': virusTotalConfig.apiKey,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      // URL has not been analyzed by VirusTotal yet
      return {
        available: true,
        matched: false,
        maliciousCount: 0,
        note: 'URL not found in VirusTotal database'
      };
    }

    if (!response.ok) {
      logger.warn(`VirusTotal API returned status ${response.status}`);
      return {
        available: false,
        error: `API HTTP status ${response.status}`,
        matched: false,
        maliciousCount: 0
      };
    }

    const data = await response.json();
    const stats = data.data?.attributes?.last_analysis_stats || {};
    const maliciousCount = stats.malicious || 0;
    const suspiciousCount = stats.suspicious || 0;
    const matched = maliciousCount > 0 || suspiciousCount > 0;

    return {
      available: true,
      enabled: true,
      matched,
      maliciousCount,
      suspiciousCount,
      stats
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const isTimeout = error.name === 'AbortError';
    logger.error({ error: error.message, isTimeout }, 'VirusTotal API lookup failed');

    return {
      available: false,
      error: isTimeout ? 'Request timeout' : error.message,
      matched: false,
      maliciousCount: 0
    };
  }
}
