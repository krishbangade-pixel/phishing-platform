import { describe, it, expect } from 'vitest';
import { analyzeEmail, analyzeMessage } from '../src/services/emailAnalysisService.js';

describe('Email and Message Analysis Engine (emailAnalysisService)', () => {
  it('should analyze normal benign email with minimal findings', () => {
    const result = analyzeEmail({
      subject: 'Weekly Team Meeting Notes',
      content: 'Hi Team, Here are the meeting notes from today. See you next week!',
      sender: 'manager@company.com'
    });

    expect(result.findings).toHaveLength(0);
    expect(result.metadata.extractedUrls).toHaveLength(0);
  });

  it('should detect urgency language in email subject and content', () => {
    const result = analyzeEmail({
      subject: 'URGENT: Action Required Immediately!',
      content: 'Your account will be suspended within 24 hours. Act now!',
      sender: 'security@alert-system.com'
    });

    const urgencyFinding = result.findings.find(f => f.code === 'URGENCY_LANGUAGE');
    const subjectFinding = result.findings.find(f => f.code === 'SUBJECT_URGENCY');
    expect(urgencyFinding).toBeDefined();
    expect(subjectFinding).toBeDefined();
  });

  it('should detect credential harvesting requests', () => {
    const result = analyzeEmail({
      subject: 'Verify Login',
      content: 'Please enter password and provide OTP to confirm your banking details.',
      sender: 'auth@support.com'
    });

    const credFinding = result.findings.find(f => f.code === 'CREDENTIAL_REQUEST');
    expect(credFinding).toBeDefined();
    expect(credFinding.severity).toBe('high');
  });

  it('should detect financial scam indicators in chat messages', () => {
    const result = analyzeMessage('Congratulations! You won a lottery prize. Claim instant payout now.');

    const scamFinding = result.findings.find(f => f.code === 'FINANCIAL_SCAM_INDICATOR');
    expect(scamFinding).toBeDefined();
  });

  it('should extract and recursively analyze suspicious links in content', () => {
    const result = analyzeEmail({
      subject: 'Account Notice',
      content: 'Click here to verify: http://192.168.1.1/login-verify-account',
      sender: 'billing@bank.com'
    });

    expect(result.metadata.extractedUrls).toContain('http://192.168.1.1/login-verify-account');
    const linkFinding = result.findings.find(f => f.code === 'SUSPICIOUS_LINK_IN_MESSAGE');
    expect(linkFinding).toBeDefined();
  });

  it('should detect sender vs reply-to domain mismatch', () => {
    const result = analyzeEmail({
      subject: 'Invoice Update',
      content: 'Please find attached invoice.',
      sender: 'billing@companyA.com',
      replyTo: 'hacker@companyB.com'
    });

    const mismatchFinding = result.findings.find(f => f.code === 'REPLY_TO_MISMATCH');
    expect(mismatchFinding).toBeDefined();
  });
});
