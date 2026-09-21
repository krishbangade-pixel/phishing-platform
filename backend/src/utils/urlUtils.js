import { TARGET_BRANDS } from '../constants/keywordConstants.js';

export function validateAndParseUrl(urlString, maxLength = 2048) {
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string' };
  }

  const trimmed = urlString.trim();

  if (trimmed.length > maxLength) {
    return { valid: false, error: `URL exceeds maximum length of ${maxLength} characters` };
  }

  // Prepend protocol if missing for basic parse test
  let formattedUrl = trimmed;
  if (!/^https?:\/\//i.test(formattedUrl)) {
    // Check if it starts with another protocol
    if (/^[a-z0-9+.-]+:\/\//i.test(formattedUrl)) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are supported' };
    }
    formattedUrl = 'http://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);
    if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are supported' };
    }

    if (!parsed.hostname || parsed.hostname.length === 0) {
      return { valid: false, error: 'URL contains an invalid hostname' };
    }

    // Hostname validation: reject symbols like !, @, $, %, ^, &, *, (, ), etc. in hostname
    const validHostnameRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^\[?[0-9a-fA-F:]+\]?$/;
    const isPuny = parsed.hostname.toLowerCase().includes('xn--');

    if (!validHostnameRegex.test(parsed.hostname) && !isPuny) {
      return { valid: false, error: 'URL contains an invalid hostname format' };
    }

    return {
      valid: true,
      parsed,
      formattedUrl
    };
  } catch (err) {
    return { valid: false, error: 'Malformed URL format' };
  }
}

export function normalizeUrl(parsedUrl) {
  try {
    const clone = new URL(parsedUrl.href);
    clone.hostname = clone.hostname.toLowerCase();
    // Remove default ports
    if ((clone.protocol === 'http:' && clone.port === '80') || (clone.protocol === 'https:' && clone.port === '443')) {
      clone.port = '';
    }
    // Sort query params alphabetically
    clone.searchParams.sort();
    return clone.href;
  } catch {
    return parsedUrl.href;
  }
}

export function isRawIpAddress(hostname) {
  if (!hostname) return false;
  // IPv4 regex
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  // IPv6 regex
  const ipv6Regex = /^\[?[0-9a-fA-F:]+\]?$/;
  return ipv4Regex.test(hostname) || (hostname.includes(':') && ipv6Regex.test(hostname));
}

export function countSubdomains(hostname) {
  if (!hostname || isRawIpAddress(hostname)) return 0;
  const parts = hostname.toLowerCase().split('.').filter(Boolean);
  // Standard domain example.com has 2 parts, sub.example.com has 3 parts (1 subdomain)
  if (parts.length <= 2) return 0;
  // Account for www
  let subCount = parts.length - 2;
  if (parts[0] === 'www') {
    subCount -= 1;
  }
  return Math.max(0, subCount);
}

export function countHyphens(hostname) {
  if (!hostname) return 0;
  return (hostname.match(/-/g) || []).length;
}

export function isPunycode(hostname) {
  if (!hostname) return false;
  return hostname.toLowerCase().includes('xn--');
}

export function detectLookalikeDomain(hostname) {
  if (!hostname || isRawIpAddress(hostname)) return { isLookalike: false };

  const lowerHost = hostname.toLowerCase();

  // Character substitution normalizing
  let normalizedHost = lowerHost
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/5/g, 's')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w');

  for (const brand of TARGET_BRANDS) {
    // Official domain or subdomain check
    if (lowerHost === brand + '.com' || lowerHost.endsWith('.' + brand + '.com')) {
      continue;
    }

    // Check if brand keyword appears in hostname or normalized hostname
    if (lowerHost.includes(brand)) {
      return {
        isLookalike: true,
        matchedBrand: brand,
        reason: `Domain contains brand name '${brand}' in a suspicious domain structure.`
      };
    }

    if (normalizedHost.includes(brand)) {
      return {
        isLookalike: true,
        matchedBrand: brand,
        reason: `Domain uses character substitution (e.g. 0/1/rn) to impersonate '${brand}'.`
      };
    }
  }

  return { isLookalike: false };
}


export function checkUrlEncoding(urlString) {
  if (!urlString) return { count: 0, highEncoding: false };
  const matches = urlString.match(/%[0-9a-fA-F]{2}/g) || [];
  const count = matches.length;
  // High encoding if more than 5 encoded characters
  return {
    count,
    highEncoding: count >= 5
  };
}
