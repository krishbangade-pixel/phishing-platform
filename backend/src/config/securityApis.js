import { env } from './env.js';

export const googleSafeBrowsingConfig = {
  enabled: env.GOOGLE_SAFE_BROWSING_ENABLED && Boolean(env.GOOGLE_SAFE_BROWSING_API_KEY),
  apiKey: env.GOOGLE_SAFE_BROWSING_API_KEY,
  endpoint: 'https://safebrowsing.googleapis.com/v4/threatMatches:find',
  timeoutMs: 5000
};

export const virusTotalConfig = {
  enabled: env.VIRUSTOTAL_ENABLED && Boolean(env.VIRUSTOTAL_API_KEY),
  apiKey: env.VIRUSTOTAL_API_KEY,
  endpoint: 'https://www.virustotal.com/api/v3/urls',
  timeoutMs: 5000
};
