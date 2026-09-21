import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, AlertTriangle, ShieldAlert, ArrowLeft, Copy, Check, RefreshCcw, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
import RiskScoreDisplay from '../components/common/RiskScoreDisplay.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import FindingList from '../components/reports/FindingList.jsx';
import SecurityApiBadge from '../components/reports/SecurityApiBadge.jsx';
import TechnicalMetadata from '../components/reports/TechnicalMetadata.jsx';
import { validateUrl } from '../utils/validators.js';
import { scanUrl } from '../services/scanService.js';
import { useToast } from '../hooks/useToast.js';

export default function URLScannerPage() {
  const { showToast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setInputError('');
    setScanResult(null);

    const validation = validateUrl(url);
    if (!validation.valid) {
      setInputError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const response = await scanUrl(validation.normalizedUrl);
      setScanResult(response.data);
      showToast('URL scan completed and saved to history!', 'success');
    } catch (err) {
      setInputError(err.message || 'Failed to complete URL scan.');
      showToast('Scan error: ' + (err.message || 'Failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!scanResult) return;
    const summaryText = `[PhishShield AI Scan Report]
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
            {/* Page Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4" />
                <span>Domain & URL Telemetry Module</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">URL Threat Scanner</h1>
              <p className="text-xs text-slate-400 mt-1">
                Analyze domain structures, SSL status, typosquatting patterns, and threat intelligence listings.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="glass-card p-6 border-slate-800 space-y-4">
              {/* Anti-visit Warning */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Security Advisory:</strong> Do not open or visit suspicious URLs in your browser prior to inspection.
                </span>
              </div>

              <form onSubmit={handleScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target URL or Web Address</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://login-verify-account-security-update.com/signin"
                      className="glass-input w-full pl-10 pr-24 text-xs font-mono"
                      disabled={loading}
                    />
                    {url && (
                      <button
                        type="button"
                        onClick={() => setUrl('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {inputError && (
                    <p className="text-xs text-rose-400 mt-1 font-medium">{inputError}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="btn-primary text-xs font-bold py-3 px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing URL Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Scan URL Target</span>
                      </>
                    )}
                  </button>

                  {scanResult && (
                    <button
                      type="button"
                      onClick={() => {
                        setScanResult(null);
                        setUrl('');
                      }}
                      className="btn-secondary py-2.5 px-4 text-xs"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>New URL Scan</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Scan Results View */}
            {scanResult && (
              <div className="glass-card p-6 border-slate-800 space-y-6 animate-in fade-in">
                {/* Result Header */}
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
                      title="Copy Summary"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                </div>

                {/* Score & Recommendation Banner */}
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
                      <ShieldAlert className="w-4 h-4 text-brand-cyan" />
                      Platform Security Recommendation
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-cyber-900 p-3 rounded-lg border border-slate-800">
                      {scanResult.recommendation}
                    </p>
                  </div>
                </div>

                {/* Findings List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Rule Violation & Heuristic Findings</h3>
                  <FindingList findings={scanResult.findings} />
                </div>

                {/* Security API Checks */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Multi-Engine Intelligence API Status</h3>
                  <SecurityApiBadge apiResults={scanResult.api_results} />
                </div>

                {/* Technical Metadata */}
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
