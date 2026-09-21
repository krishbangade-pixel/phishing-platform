import { describe, it, expect } from 'vitest';
import { calculateRiskScore } from '../src/services/riskScoringService.js';
import { RISK_LEVELS, SCAN_STATUS } from '../src/constants/riskConstants.js';

describe('Risk Scoring Engine (riskScoringService)', () => {
  it('should calculate LOW risk level for zero or low findings', () => {
    const result = calculateRiskScore([], {});
    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe(RISK_LEVELS.LOW);
    expect(result.status).toBe(SCAN_STATUS.SAFE);
  });

  it('should calculate MEDIUM risk score correctly', () => {
    const findings = [
      { code: 'RAW_IP_ADDRESS', severity: 'medium' }, // 25
      { code: 'HTTP_PROTOCOL', severity: 'low' }      // 10
    ];
    const result = calculateRiskScore(findings, {});
    expect(result.riskScore).toBe(35);
    expect(result.riskLevel).toBe(RISK_LEVELS.MEDIUM);
    expect(result.status).toBe(SCAN_STATUS.SUSPICIOUS);
  });

  it('should calculate HIGH risk score correctly', () => {
    const findings = [
      { code: 'CREDENTIAL_REQUEST', severity: 'high' },      // 30
      { code: 'SUSPICIOUS_LINK_IN_MESSAGE', severity: 'high' },// 25
      { code: 'URGENCY_LANGUAGE', severity: 'medium' }       // 20
    ];
    const result = calculateRiskScore(findings, {});
    expect(result.riskScore).toBe(75);
    expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
  });

  it('should cap risk score at 100 max', () => {
    const findings = [
      { code: 'LOOKALIKE_DOMAIN' },       // 30
      { code: 'CREDENTIAL_REQUEST' },     // 30
      { code: 'SUSPICIOUS_LINK_IN_MESSAGE' }, // 25
      { code: 'RAW_IP_ADDRESS' },         // 25
      { code: 'PUNYCODE_DOMAIN' }          // 20
    ];
    const result = calculateRiskScore(findings, {});
    expect(result.riskScore).toBe(100);
    expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
  });

  it('should prevent counting duplicate signal codes multiple times', () => {
    const findings = [
      { code: 'HTTP_PROTOCOL' }, // 10
      { code: 'HTTP_PROTOCOL' }  // duplicate
    ];
    const result = calculateRiskScore(findings, {});
    expect(result.riskScore).toBe(10);
  });

  it('should override status to malicious and risk score to >=90 if external security API matches', () => {
    const findings = [{ code: 'HTTP_PROTOCOL' }]; // 10
    const apiResults = {
      googleSafeBrowsing: {
        available: true,
        matched: true,
        threats: [{ threatType: 'SOCIAL_ENGINEERING' }]
      }
    };

    const result = calculateRiskScore(findings, apiResults);
    expect(result.riskScore).toBeGreaterThanOrEqual(90);
    expect(result.status).toBe(SCAN_STATUS.MALICIOUS);
    expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);

    const threatFinding = result.findings.find(f => f.code === 'EXTERNAL_THREAT_MATCH');
    expect(threatFinding).toBeDefined();
  });
});
