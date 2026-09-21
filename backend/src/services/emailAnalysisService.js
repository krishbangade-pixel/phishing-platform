import {
  sanitizeText,
  extractUrlsFromText,
  containsKeywords,
  generateSafePreview,
  validateEmailFormat
} from '../utils/textUtils.js';
import {
  URGENCY_PHRASES,
  CREDENTIAL_REQUEST_PHRASES,
  FINANCIAL_SCAM_PHRASES
} from '../constants/keywordConstants.js';
import { analyzeUrl } from './urlAnalysisService.js';

export function analyzeEmail({ subject = '', content = '', sender = '', replyTo = '' }, options = {}) {
  const maxContentLength = options.maxContentLength || 20000;
  const sanitizedSubject = sanitizeText(subject, 500);
  const sanitizedContent = sanitizeText(content, maxContentLength);
  const sanitizedSender = sender ? sender.trim() : '';

  const findings = [];
  const extractedUrlFindings = [];

  // Safe preview generation (privacy compliance: do not store full body in raw DB target field)
  const safePreview = generateSafePreview(
    sanitizedSubject ? `Subject: ${sanitizedSubject} | ${sanitizedContent}` : sanitizedContent,
    200
  );

  // 1. Urgency Language Detection in Body & Subject
  const urgencyInSubject = containsKeywords(sanitizedSubject, URGENCY_PHRASES);
  const urgencyInContent = containsKeywords(sanitizedContent, URGENCY_PHRASES);
  const allUrgencyMatches = Array.from(new Set([...urgencyInSubject, ...urgencyInContent]));

  if (allUrgencyMatches.length > 0) {
    findings.push({
      code: 'URGENCY_LANGUAGE',
      severity: 'medium',
      message: `Content uses pressure or urgency language: ${allUrgencyMatches.slice(0, 3).join(', ')}`,
      details: { matches: allUrgencyMatches }
    });
  }

  if (urgencyInSubject.length > 0) {
    findings.push({
      code: 'SUBJECT_URGENCY',
      severity: 'low',
      message: `Email subject contains urgency or security alert phrasing.`,
      details: { matches: urgencyInSubject }
    });
  }

  // 2. Credential Request Detection
  const credentialMatches = containsKeywords(sanitizedContent, CREDENTIAL_REQUEST_PHRASES);
  if (credentialMatches.length > 0) {
    findings.push({
      code: 'CREDENTIAL_REQUEST',
      severity: 'high',
      message: `Message attempts to elicit login credentials, OTPs, or sensitive information.`,
      details: { matches: credentialMatches }
    });
  }

  // 3. Financial Scam Indicators
  const financialMatches = containsKeywords(sanitizedContent, FINANCIAL_SCAM_PHRASES);
  if (financialMatches.length > 0) {
    findings.push({
      code: 'FINANCIAL_SCAM_INDICATOR',
      severity: 'medium',
      message: `Content contains phrases associated with financial scams, lotteries, or unexpected rewards.`,
      details: { matches: financialMatches }
    });
  }

  // 4. Sender Analysis
  if (sanitizedSender) {
    if (!validateEmailFormat(sanitizedSender)) {
      findings.push({
        code: 'INVALID_SENDER_FORMAT',
        severity: 'low',
        message: `Provided sender email address '${sanitizedSender}' has an invalid format.`
      });
    }

    if (replyTo && validateEmailFormat(replyTo)) {
      const senderDomain = sanitizedSender.split('@')[1]?.toLowerCase();
      const replyToDomain = replyTo.split('@')[1]?.toLowerCase();

      if (senderDomain && replyToDomain && senderDomain !== replyToDomain) {
        findings.push({
          code: 'REPLY_TO_MISMATCH',
          severity: 'medium',
          message: `Sender domain (${senderDomain}) differs from Reply-To domain (${replyToDomain}).`
        });
      }
    }
  }

  // 5. Extract & Analyze Links in Message Body
  const extractedUrls = extractUrlsFromText(sanitizedContent, 5);
  const linkScanResults = [];

  for (const url of extractedUrls) {
    const urlAnalysis = analyzeUrl(url);
    linkScanResults.push(urlAnalysis);

    if (urlAnalysis.valid && urlAnalysis.findings.length > 0) {
      findings.push({
        code: 'SUSPICIOUS_LINK_IN_MESSAGE',
        severity: 'high',
        message: `Message contains a suspicious URL: ${url}`,
        details: { url, urlFindings: urlAnalysis.findings }
      });
    }
  }

  return {
    target: safePreview,
    normalizedTarget: safePreview,
    findings,
    metadata: {
      subject: sanitizedSubject,
      sender: sanitizedSender,
      contentLength: sanitizedContent.length,
      extractedUrlCount: extractedUrls.length,
      extractedUrls,
      linkScanResults
    }
  };
}

export function analyzeMessage(content, options = {}) {
  return analyzeEmail({ subject: '', content }, options);
}
