/**
 * Mock data for standalone frontend preview and testing
 */
export const MOCK_USER = {
  id: 'usr_demo_12345',
  email: 'security.analyst@domain.com',
  user_metadata: {
    full_name: 'Alex Cybersecurity',
  },
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const INITIAL_MOCK_SCANS = [
  {
    id: 'scan-url-8891',
    scan_type: 'url',
    target: 'http://login-verify-account-security-update.com/signin',
    normalized_target: 'login-verify-account-security-update.com',
    risk_score: 88,
    risk_level: 'High',
    status: 'Malicious',
    findings: [
      {
        rule: 'TYPOSQUATTING_PATTERN',
        title: 'Typosquatting & Suspicious Keywords',
        severity: 'high',
        description: 'Domain contains multiple high-risk credential harvesting keywords ("verify", "security-update", "signin").',
        weight: 35
      },
      {
        rule: 'SUSPICIOUS_TLD',
        title: 'High Risk Top-Level Domain',
        severity: 'medium',
        description: 'Domain uses a newly registered untrusted TLD frequently associated with phishing campaigns.',
        weight: 20
      },
      {
        rule: 'NO_HTTPS_ENCRYPTION',
        title: 'Missing SSL / TLS Certificate',
        severity: 'medium',
        description: 'Submissions to this target are unencrypted, exposing user credentials to eavesdropping.',
        weight: 15
      },
      {
        rule: 'GSB_MALICIOUS_MATCH',
        title: 'Google Safe Browsing Match',
        severity: 'high',
        description: 'Identified as a social engineering site by Google Safe Browsing threat database.',
        weight: 30
      }
    ],
    recommendation: 'DO NOT visit this URL or enter any personal or banking credentials. This domain exhibits extreme indicators of a credential harvesting phishing site.',
    api_results: {
      googleSafeBrowsing: { listed: true, threatType: 'SOCIAL_ENGINEERING', matches: ['MALICIOUS'] },
      virusTotal: { detectedCount: 14, totalEngineCount: 90, status: 'MALICIOUS', permalink: 'https://virustotal.com/example' }
    },
    metadata: {
      domainAgeDays: 3,
      ipAddress: '185.220.101.4',
      registrar: 'NameCheap Inc.',
      protocol: 'http:'
    },
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'scan-email-4432',
    scan_type: 'email',
    target: 'Subject: Urgent: Your Bank Account Access Is Temporarily Locked',
    normalized_target: 'Urgent Account Verification Request',
    risk_score: 92,
    risk_level: 'Critical',
    status: 'Malicious',
    findings: [
      {
        rule: 'URGENCY_MANIPULATION',
        title: 'Psychological Urgency & Fear Tactics',
        severity: 'critical',
        description: 'Email leverages artificial panic ("temporarily locked", "immediate action required within 2 hours") to bypass logical skepticism.',
        weight: 30
      },
      {
        rule: 'SENDER_DOMAIN_MISMATCH',
        title: 'Spoofed Sender Header Mismatch',
        severity: 'high',
        description: 'Friendly display name claims "Chase Security" but actual envelope sender is "alert-notice@mail-serv-x99.xyz".',
        weight: 35
      },
      {
        rule: 'CREDENTIAL_HARVEST_LINK',
        title: 'Embedded Suspicious Redirection Link',
        severity: 'high',
        description: 'Extracted link leads to a non-official IP address host designed to steal web login tokens.',
        weight: 27
      }
    ],
    recommendation: 'Delete this email immediately. Do not click any links or download attachments. Report to your organization security response team.',
    api_results: {
      googleSafeBrowsing: { listed: true, threatType: 'SOCIAL_ENGINEERING' },
      virusTotal: { detectedCount: 8, totalEngineCount: 88, status: 'SUSPICIOUS' }
    },
    metadata: {
      sender: 'Chase Security Alerts <alert-notice@mail-serv-x99.xyz>',
      replyTo: 'no-reply@external-phish.net',
      extractedUrls: ['http://185.220.101.4/chase-auth-login']
    },
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-msg-1290',
    scan_type: 'message',
    target: 'SMS: USPS: Package delivery failed due to incomplete address. Update now: http://usps-re-route-package.top/id',
    normalized_target: 'USPS Package Delivery Alert SMS',
    risk_score: 78,
    risk_level: 'High',
    status: 'Suspicious',
    findings: [
      {
        rule: 'SMISHING_PATTERN',
        title: 'Smishing Postal Delivery Scam',
        severity: 'high',
        description: 'Text message mimics postal authority regarding failed delivery to solicit address and payment card info.',
        weight: 40
      },
      {
        rule: 'SHORTENED_UNTRUSTED_LINK',
        title: 'Non-Official Brand Link',
        severity: 'medium',
        description: 'Official postal service is usps.com. This message utilizes "usps-re-route-package.top".',
        weight: 38
      }
    ],
    recommendation: 'Do not tap the link in the message. Official postal services never request fee payments or address updates via random third-party domains.',
    api_results: {
      googleSafeBrowsing: { listed: false },
      virusTotal: { detectedCount: 2, totalEngineCount: 90, status: 'SUSPICIOUS' }
    },
    metadata: {
      extractedUrls: ['http://usps-re-route-package.top/id']
    },
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-url-1002',
    scan_type: 'url',
    target: 'https://github.com/facebook/react',
    normalized_target: 'github.com/facebook/react',
    risk_score: 5,
    risk_level: 'Low',
    status: 'Safe',
    findings: [
      {
        rule: 'TRUSTED_DOMAIN',
        title: 'Established High Trust Domain',
        severity: 'low',
        description: 'Domain ranks among top global legitimate software repositories with valid SSL certificate.',
        weight: 0
      }
    ],
    recommendation: 'No known security threats detected for this domain. Standard safe browsing practices apply.',
    api_results: {
      googleSafeBrowsing: { listed: false, status: 'CLEAN' },
      virusTotal: { detectedCount: 0, totalEngineCount: 92, status: 'CLEAN' }
    },
    metadata: {
      domainAgeDays: 6200,
      ipAddress: '140.82.121.4',
      registrar: 'MarkMonitor Inc.',
      protocol: 'https:'
    },
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-email-0091',
    scan_type: 'email',
    target: 'Subject: Team Meeting Notes & Weekly Sprint Roadmap',
    normalized_target: 'Weekly Team Update Email',
    risk_score: 12,
    risk_level: 'Low',
    status: 'Safe',
    findings: [],
    recommendation: 'No indicators of phishing or social engineering detected in this email payload.',
    api_results: {
      googleSafeBrowsing: { listed: false },
      virusTotal: { detectedCount: 0, totalEngineCount: 92, status: 'CLEAN' }
    },
    metadata: {
      sender: 'Sarah Jenkins <sjenkins@company.org>',
      replyTo: 'sjenkins@company.org',
      extractedUrls: ['https://docs.google.com/document/d/example']
    },
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  }
];
