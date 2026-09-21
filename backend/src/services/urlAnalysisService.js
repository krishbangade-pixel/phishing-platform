import {
  validateAndParseUrl,
  normalizeUrl,
  isRawIpAddress,
  countSubdomains,
  countHyphens,
  isPunycode,
  detectLookalikeDomain,
  checkUrlEncoding
} from '../utils/urlUtils.js';
import { containsKeywords } from '../utils/textUtils.js';
import { SUSPICIOUS_URL_KEYWORDS } from '../constants/keywordConstants.js';

export function analyzeUrl(rawUrl, maxUrlLength = 2048) {
  const validation = validateAndParseUrl(rawUrl, maxUrlLength);

  if (!validation.valid) {
    return {
      valid: false,
      error: validation.error,
      findings: [
        {
          code: 'INVALID_URL',
          severity: 'high',
          message: validation.error
        }
      ]
    };
  }

  const { parsed } = validation;
  const normalizedTarget = normalizeUrl(parsed);
  const hostname = parsed.hostname;
  const fullPathAndSearch = parsed.pathname + parsed.search;
  const findings = [];

  // 1. HTTP Detection
  if (parsed.protocol.toLowerCase() === 'http:') {
    findings.push({
      code: 'HTTP_PROTOCOL',
      severity: 'low',
      message: 'The URL does not use HTTPS encryption.'
    });
  }

  // 2. IP Address Detection
  if (isRawIpAddress(hostname)) {
    findings.push({
      code: 'RAW_IP_ADDRESS',
      severity: 'medium',
      message: 'The URL uses a raw IP address instead of a domain name.'
    });
  }

  // 3. Suspicious Keywords
  const matchedKeywords = containsKeywords(parsed.href, SUSPICIOUS_URL_KEYWORDS);
  if (matchedKeywords.length > 0) {
    findings.push({
      code: 'SUSPICIOUS_KEYWORDS',
      severity: 'medium',
      message: `The URL contains suspicious security or authentication keywords: ${matchedKeywords.join(', ')}`,
      details: { keywords: matchedKeywords }
    });
  }

  // 4. Excessive Subdomains
  const subCount = countSubdomains(hostname);
  if (subCount >= 2) {
    findings.push({
      code: 'EXCESSIVE_SUBDOMAINS',
      severity: 'medium',
      message: `The hostname contains an unusually high number of subdomains (${subCount}).`
    });
  }

  // 5. Excessive Hyphens
  const hyphenCount = countHyphens(hostname);
  if (hyphenCount >= 3) {
    findings.push({
      code: 'EXCESSIVE_HYPHENS',
      severity: 'low',
      message: `The hostname contains an excessive number of hyphens (${hyphenCount}).`
    });
  }

  // 6. URL Length
  if (parsed.href.length > 75) {
    findings.push({
      code: 'LONG_URL',
      severity: 'low',
      message: `The URL is unusually long (${parsed.href.length} characters).`
    });
  }

  // 7. Encoded URL Components
  const encoding = checkUrlEncoding(parsed.href);
  if (encoding.highEncoding) {
    findings.push({
      code: 'HIGH_ENTROPY_ENCODING',
      severity: 'low',
      message: `The URL contains a high number of encoded characters (${encoding.count}).`
    });
  }

  // 8. Punycode Detection
  if (isPunycode(hostname)) {
    findings.push({
      code: 'PUNYCODE_DOMAIN',
      severity: 'medium',
      message: 'The domain uses Punycode encoding (xn--), which may indicate a lookalike domain.'
    });
  }

  // 9. Lookalike Domain Detection
  const lookalikeResult = detectLookalikeDomain(hostname);
  if (lookalikeResult.isLookalike) {
    findings.push({
      code: 'LOOKALIKE_DOMAIN',
      severity: 'high',
      message: lookalikeResult.reason || 'This domain may resemble a known brand or service.',
      details: { matchedBrand: lookalikeResult.matchedBrand }
    });
  }

  return {
    valid: true,
    target: rawUrl,
    normalizedTarget,
    hostname,
    findings,
    metadata: {
      protocol: parsed.protocol,
      hostname,
      pathname: parsed.pathname,
      subdomainCount: subCount,
      hyphenCount,
      urlLength: parsed.href.length
    }
  };
}
