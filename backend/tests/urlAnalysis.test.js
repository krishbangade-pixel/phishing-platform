import { describe, it, expect } from 'vitest';
import { analyzeUrl } from '../src/services/urlAnalysisService.js';

describe('URL Analysis Engine (urlAnalysisService)', () => {
  it('should pass clean valid HTTPS URL with low risk findings', () => {
    const result = analyzeUrl('https://example.com');
    expect(result.valid).toBe(true);
    expect(result.normalizedTarget).toBe('https://example.com/');
    expect(result.findings).toHaveLength(0);
  });

  it('should detect HTTP protocol and flag as low severity finding', () => {
    const result = analyzeUrl('http://example.com');
    expect(result.valid).toBe(true);
    const httpFinding = result.findings.find(f => f.code === 'HTTP_PROTOCOL');
    expect(httpFinding).toBeDefined();
    expect(httpFinding.severity).toBe('low');
  });

  it('should reject invalid or malformed URLs', () => {
    const result = analyzeUrl('not-a-valid-url-format-!!!');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should flag raw IP address URLs', () => {
    const result = analyzeUrl('http://192.168.1.1/login');
    expect(result.valid).toBe(true);
    const ipFinding = result.findings.find(f => f.code === 'RAW_IP_ADDRESS');
    expect(ipFinding).toBeDefined();
    expect(ipFinding.severity).toBe('medium');
  });

  it('should detect suspicious keywords in URL', () => {
    const result = analyzeUrl('https://secure-login-verify-account.com/update-password');
    expect(result.valid).toBe(true);
    const keywordFinding = result.findings.find(f => f.code === 'SUSPICIOUS_KEYWORDS');
    expect(keywordFinding).toBeDefined();
    expect(keywordFinding.details.keywords).toContain('login');
    expect(keywordFinding.details.keywords).toContain('verify');
  });

  it('should flag excessive subdomains', () => {
    const result = analyzeUrl('https://login.security.verify.account.example.com');
    expect(result.valid).toBe(true);
    const subFinding = result.findings.find(f => f.code === 'EXCESSIVE_SUBDOMAINS');
    expect(subFinding).toBeDefined();
  });

  it('should flag excessive hyphens in domain', () => {
    const result = analyzeUrl('https://my-secure-bank-login-update-online.com');
    expect(result.valid).toBe(true);
    const hyphenFinding = result.findings.find(f => f.code === 'EXCESSIVE_HYPHENS');
    expect(hyphenFinding).toBeDefined();
  });

  it('should flag unusually long URLs', () => {
    const longPath = 'a'.repeat(80);
    const result = analyzeUrl(`https://example.com/${longPath}`);
    expect(result.valid).toBe(true);
    const longFinding = result.findings.find(f => f.code === 'LONG_URL');
    expect(longFinding).toBeDefined();
  });

  it('should detect Punycode lookalike domains', () => {
    const result = analyzeUrl('https://xn--pypal-4ve.com');
    expect(result.valid).toBe(true);
    const punycodeFinding = result.findings.find(f => f.code === 'PUNYCODE_DOMAIN');
    expect(punycodeFinding).toBeDefined();
  });

  it('should detect lookalike domain impersonation heuristics', () => {
    const result = analyzeUrl('https://paypa1-security-update.com');
    expect(result.valid).toBe(true);
    const lookalikeFinding = result.findings.find(f => f.code === 'LOOKALIKE_DOMAIN');
    expect(lookalikeFinding).toBeDefined();
  });

  it('should detect high entropy encoded URL characters', () => {
    const result = analyzeUrl('https://example.com/search?q=%20%21%22%23%24%25%26%27');
    expect(result.valid).toBe(true);
    const encodingFinding = result.findings.find(f => f.code === 'HIGH_ENTROPY_ENCODING');
    expect(encodingFinding).toBeDefined();
  });
});
