export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const SCAN_STATUS = {
  SAFE: 'safe',
  SUSPICIOUS: 'suspicious',
  MALICIOUS: 'malicious',
  UNKNOWN: 'unknown'
};

export const SCAN_TYPES = {
  URL: 'url',
  EMAIL: 'email',
  MESSAGE: 'message'
};

export const RISK_WEIGHTS = {
  HTTP_PROTOCOL: 10,
  SUSPICIOUS_KEYWORDS: 15,
  RAW_IP_ADDRESS: 25,
  EXCESSIVE_SUBDOMAINS: 15,
  EXCESSIVE_HYPHENS: 15,
  LONG_URL: 10,
  HIGH_ENTROPY_ENCODING: 10,
  PUNYCODE_DOMAIN: 20,
  LOOKALIKE_DOMAIN: 30,
  URGENCY_LANGUAGE: 20,
  CREDENTIAL_REQUEST: 30,
  FINANCIAL_SCAM_INDICATOR: 20,
  SUSPICIOUS_LINK_IN_MESSAGE: 25,
  SUBJECT_URGENCY: 15
};

export const RISK_THRESHOLDS = {
  LOW_MAX: 24,
  MEDIUM_MAX: 49,
  HIGH_MAX: 74
};

export function determineRiskLevel(score) {
  if (score <= RISK_THRESHOLDS.LOW_MAX) return RISK_LEVELS.LOW;
  if (score <= RISK_THRESHOLDS.MEDIUM_MAX) return RISK_LEVELS.MEDIUM;
  if (score <= RISK_THRESHOLDS.HIGH_MAX) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

export function determineStatus(score, hasMaliciousApiMatch = false) {
  if (hasMaliciousApiMatch) return SCAN_STATUS.MALICIOUS;
  if (score < 25) return SCAN_STATUS.SAFE;
  if (score < 60) return SCAN_STATUS.SUSPICIOUS;
  return SCAN_STATUS.MALICIOUS;
}
