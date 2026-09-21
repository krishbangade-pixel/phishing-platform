import {
  RISK_WEIGHTS,
  determineRiskLevel,
  determineStatus
} from '../constants/riskConstants.js';

export function calculateRiskScore(findings = [], apiResults = {}) {
  let score = 0;
  const processedCodes = new Set();
  const adjustedFindings = [...findings];

  // 1. Process local heuristic findings
  for (const finding of findings) {
    const code = finding.code;
    if (code && !processedCodes.has(code)) {
      processedCodes.add(code);
      const weight = RISK_WEIGHTS[code] || 10;
      score += weight;
    }
  }

  // 2. Check Security API Overrides (Google Safe Browsing & VirusTotal)
  const gsbMatched = apiResults.googleSafeBrowsing?.matched === true;
  const vtMatched = apiResults.virusTotal?.matched === true;
  const hasMaliciousApiMatch = gsbMatched || vtMatched;

  if (hasMaliciousApiMatch) {
    // Override risk score to at least 90 for confirmed external threats
    score = Math.max(score, 90);

    const apiNames = [];
    if (gsbMatched) apiNames.push('Google Safe Browsing');
    if (vtMatched) apiNames.push('VirusTotal');

    adjustedFindings.unshift({
      code: 'EXTERNAL_THREAT_MATCH',
      severity: 'high',
      message: `Confirmed malicious threat detected by security intelligence (${apiNames.join(', ')}).`,
      details: {
        googleSafeBrowsing: apiResults.googleSafeBrowsing,
        virusTotal: apiResults.virusTotal
      }
    });
  }

  // 3. Cap score at 100
  const finalScore = Math.min(Math.max(0, score), 100);

  // 4. Derive risk level and status
  const riskLevel = determineRiskLevel(finalScore);
  const status = determineStatus(finalScore, hasMaliciousApiMatch);

  // 5. Generate human-readable recommendation
  const recommendation = generateRecommendation(finalScore, riskLevel, status, adjustedFindings);

  return {
    riskScore: finalScore,
    riskLevel,
    status,
    findings: adjustedFindings,
    recommendation
  };
}

function generateRecommendation(score, riskLevel, status, findings) {
  if (status === 'malicious' || riskLevel === 'CRITICAL') {
    return 'DANGER: High threat detected. Do not click links, open attachments, or submit any credentials or sensitive information.';
  }

  if (riskLevel === 'HIGH') {
    return 'WARNING: Multiple suspicious indicators detected. Exercise extreme caution and verify the source before proceeding.';
  }

  if (riskLevel === 'MEDIUM') {
    return 'ATTENTION: Potential security risks found. Inspect domain names, links, and content carefully.';
  }

  return 'SAFE: No significant security threats detected. Continue observing basic cybersecurity hygiene.';
}
