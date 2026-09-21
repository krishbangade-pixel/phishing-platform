import { analyzeUrl } from './urlAnalysisService.js';
import { analyzeEmail, analyzeMessage } from './emailAnalysisService.js';
import { checkGoogleSafeBrowsing } from './googleSafeBrowsingService.js';
import { checkVirusTotal } from './virusTotalService.js';
import { calculateRiskScore } from './riskScoringService.js';
import { saveScanRecord } from './historyService.js';
import logger from '../utils/logger.js';

export async function executeUrlScan(rawUrl, userId, userToken) {
  // 1. Local Heuristic Analysis
  const localAnalysis = analyzeUrl(rawUrl);

  if (!localAnalysis.valid) {
    throw {
      statusCode: 400,
      code: 'INVALID_URL',
      message: localAnalysis.error
    };
  }

  // 2. Query External Security APIs (if enabled)
  const [gsbResult, vtResult] = await Promise.all([
    checkGoogleSafeBrowsing(localAnalysis.normalizedTarget),
    checkVirusTotal(localAnalysis.normalizedTarget)
  ]);

  const apiResults = {
    googleSafeBrowsing: gsbResult,
    virusTotal: vtResult
  };

  // 3. Risk Scoring & Threat Overrides
  const scoring = calculateRiskScore(localAnalysis.findings, apiResults);

  // 4. Construct Scan DB Record Payload
  const scanPayload = {
    user_id: userId,
    scan_type: 'url',
    target: rawUrl,
    normalized_target: localAnalysis.normalizedTarget,
    risk_score: scoring.riskScore,
    risk_level: scoring.riskLevel,
    status: scoring.status,
    findings: scoring.findings,
    recommendation: scoring.recommendation,
    api_results: apiResults,
    metadata: localAnalysis.metadata
  };

  // 5. Persist Record to Supabase
  const savedRecord = await saveScanRecord(scanPayload, userToken);
  return savedRecord;
}

export async function executeEmailScan({ subject, content, sender, replyTo }, userId, userToken) {
  // 1. Local Content & Link Analysis
  const emailAnalysis = analyzeEmail({ subject, content, sender, replyTo });

  // 2. Query External Security APIs for extracted URLs
  const extractedUrls = emailAnalysis.metadata?.extractedUrls || [];
  const apiResults = {
    extractedUrlChecks: []
  };

  if (extractedUrls.length > 0) {
    const firstUrl = extractedUrls[0];
    const [gsbResult, vtResult] = await Promise.all([
      checkGoogleSafeBrowsing(firstUrl),
      checkVirusTotal(firstUrl)
    ]);
    apiResults.googleSafeBrowsing = gsbResult;
    apiResults.virusTotal = vtResult;
  }

  // 3. Risk Scoring & Threat Overrides
  const scoring = calculateRiskScore(emailAnalysis.findings, apiResults);

  // 4. Construct Scan DB Record Payload
  const scanPayload = {
    user_id: userId,
    scan_type: 'email',
    target: emailAnalysis.target, // Safe preview
    normalized_target: emailAnalysis.normalizedTarget,
    risk_score: scoring.riskScore,
    risk_level: scoring.riskLevel,
    status: scoring.status,
    findings: scoring.findings,
    recommendation: scoring.recommendation,
    api_results: apiResults,
    metadata: emailAnalysis.metadata
  };

  // 5. Persist Record to Supabase
  const savedRecord = await saveScanRecord(scanPayload, userToken);
  return savedRecord;
}

export async function executeMessageScan(content, userId, userToken) {
  // 1. Local Content & Link Analysis
  const msgAnalysis = analyzeMessage(content);

  // 2. Query External Security APIs for extracted URLs
  const extractedUrls = msgAnalysis.metadata?.extractedUrls || [];
  const apiResults = {};

  if (extractedUrls.length > 0) {
    const firstUrl = extractedUrls[0];
    const [gsbResult, vtResult] = await Promise.all([
      checkGoogleSafeBrowsing(firstUrl),
      checkVirusTotal(firstUrl)
    ]);
    apiResults.googleSafeBrowsing = gsbResult;
    apiResults.virusTotal = vtResult;
  }

  // 3. Risk Scoring
  const scoring = calculateRiskScore(msgAnalysis.findings, apiResults);

  // 4. Construct Scan Payload
  const scanPayload = {
    user_id: userId,
    scan_type: 'message',
    target: msgAnalysis.target,
    normalized_target: msgAnalysis.normalizedTarget,
    risk_score: scoring.riskScore,
    risk_level: scoring.riskLevel,
    status: scoring.status,
    findings: scoring.findings,
    recommendation: scoring.recommendation,
    api_results: apiResults,
    metadata: msgAnalysis.metadata
  };

  // 5. Persist Record to Supabase
  const savedRecord = await saveScanRecord(scanPayload, userToken);
  return savedRecord;
}
