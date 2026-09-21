import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldAlert, AlertTriangle, ArrowLeft, Copy, Check, RefreshCcw, Loader2, Lock } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
import RiskScoreDisplay from '../components/common/RiskScoreDisplay.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import FindingList from '../components/reports/FindingList.jsx';
import SecurityApiBadge from '../components/reports/SecurityApiBadge.jsx';
import TechnicalMetadata from '../components/reports/TechnicalMetadata.jsx';
import { validateEmailScan } from '../utils/validators.js';
import { scanEmail } from '../services/scanService.js';
import { useToast } from '../hooks/useToast.js';

export default function EmailAnalyzerPage() {
  const { showToast } = useToast();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setInputError('');
    setScanResult(null);

    const validation = validateEmailScan({ subject, content });
    if (!validation.valid) {
      setInputError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const response = await scanEmail({
        subject: subject.trim(),
        content: content.trim(),
        sender: sender.trim() || undefined,
        replyTo: replyTo.trim() || undefined,
      });
      setScanResult(response.data);
      showToast('Email payload scan completed successfully!', 'success');
    } catch (err) {
      setInputError(err.message || 'Failed to complete email scan.');
      showToast('Scan error: ' + (err.message || 'Failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!scanResult) return;
    const summaryText = `[PhishShield AI Email Scan Report]
Target: ${scanResult.target}
Risk Score: ${scanResult.risk_score}/100 (${scanResult.risk_level})
Status: ${scanResult.status}
Recommendation: ${scanResult.recommendation}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    showToast('Report summary copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1 space-y-8">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
                <Mail className="w-4 h-4" />
                <span>Email Security Payload Module</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">Email Phishing Analyzer</h1>
              <p className="text-xs text-slate-400 mt-1">
                Analyze email subjects, body content, sender headers, and extracted links for phishing traps.
              </p>
            </div>

            {/* Input Form */}
            <div className="glass-card p-6 border-slate-800 space-y-4">
              <div className="p-3 rounded-lg bg-cyber-950/80 border border-slate-800 text-xs flex items-center gap-2.5 text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Privacy Notice:</strong> Submitted email content is analyzed securely and saved only to your account.
                </span>
              </div>

              <form onSubmit={handleScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Subject Line <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Urgent: Account suspended - Immediate verification required"
                    className="glass-input w-full text-xs"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Sender Email (Optional)</label>
                    <input
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="e.g. Chase Alert <no-reply@chase-secure-update.xyz>"
                      className="glass-input w-full text-xs"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Reply-To Header (Optional)</label>
                    <input
                      type="text"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      placeholder="e.g. support@external-mail-server.net"
                      className="glass-input w-full text-xs"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">
                      Email Body Payload <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {content.length}/20000 chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste full email message body content here..."
                    className="glass-input w-full text-xs font-mono leading-relaxed"
                    disabled={loading}
                  />
                </div>

                {inputError && <p className="text-xs text-rose-400 font-medium">{inputError}</p>}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || !subject.trim() || !content.trim()}
                    className="btn-primary text-xs font-bold py-3 px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Email Content...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Analyze Email Payload</span>
                      </>
                    )}
                  </button>

                  {scanResult && (
                    <button
                      type="button"
                      onClick={() => {
                        setScanResult(null);
                        setSubject('');
                        setContent('');
                        setSender('');
                        setReplyTo('');
                      }}
                      className="btn-secondary py-2.5 px-4 text-xs"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Reset Form</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Scan Results View */}
            {scanResult && (
              <div className="glass-card p-6 border-slate-800 space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Analysis Target</span>
                    <h2 className="text-lg font-bold text-white break-all">{scanResult.target}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <RiskBadge level={scanResult.risk_level} status={scanResult.status} size="lg" />
                    <button
                      onClick={handleCopySummary}
                      className="btn-secondary py-2 px-3 text-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1">
                    <RiskScoreDisplay
                      score={scanResult.risk_score}
                      level={scanResult.risk_level}
                      status={scanResult.status}
                    />
                  </div>

                  <div className="md:col-span-2 p-5 rounded-xl bg-cyber-950/80 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-blue-400" />
                      Platform Security Recommendation
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-cyber-900 p-3 rounded-lg border border-slate-800">
                      {scanResult.recommendation}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Rule Violation & Heuristic Findings</h3>
                  <FindingList findings={scanResult.findings} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Extracted Link Intelligence Checks</h3>
                  <SecurityApiBadge apiResults={scanResult.api_results} />
                </div>

                <TechnicalMetadata
                  metadata={scanResult.metadata}
                  scanId={scanResult.id}
                  createdAt={scanResult.created_at}
                  scanType={scanResult.scan_type}
                />

                <div className="pt-4 flex justify-between items-center text-xs">
                  <Link to="/scans" className="text-brand-cyan font-semibold hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>View in Scan History</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
