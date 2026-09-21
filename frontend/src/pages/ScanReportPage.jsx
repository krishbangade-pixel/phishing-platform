import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Copy, Check, Trash2, AlertTriangle, FileText } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
import RiskScoreDisplay from '../components/common/RiskScoreDisplay.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import FindingList from '../components/reports/FindingList.jsx';
import SecurityApiBadge from '../components/reports/SecurityApiBadge.jsx';
import TechnicalMetadata from '../components/reports/TechnicalMetadata.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import ConfirmationModal from '../components/common/ConfirmationModal.jsx';
import { getScanById, deleteScan } from '../services/scanService.js';
import { useToast } from '../hooks/useToast.js';

export default function ScanReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getScanById(id);
      setScan(response.data);
    } catch (err) {
      setError(err.message || 'Report not found or permission denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleCopy = () => {
    if (!scan) return;
    const summaryText = `[PhishShield AI Scan Report]
Scan ID: ${scan.id}
Type: ${scan.scan_type}
Target: ${scan.target}
Risk Score: ${scan.risk_score}/100 (${scan.risk_level})
Status: ${scan.status}
Recommendation: ${scan.recommendation}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    showToast('Report summary copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteScan(id);
      showToast('Scan record deleted.', 'success');
      navigate('/scans');
    } catch (err) {
      showToast('Deletion failed: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1 space-y-6">
            {/* Top Navigation Back Action */}
            <div className="flex items-center justify-between">
              <Link
                to="/scans"
                className="btn-secondary py-2 px-3 text-xs inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Scan History</span>
              </Link>

              {scan && (
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-secondary py-2 px-3 text-xs">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="btn-danger py-2 px-3 text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSpinner message="Retrieving individual threat report..." />
            ) : error ? (
              <ErrorMessage title="Report Access Error" message={error} onRetry={fetchReport} />
            ) : !scan ? (
              <ErrorMessage title="Report Not Found" message="The requested scan report could not be found." />
            ) : (
              <div className="glass-card p-6 border-slate-800 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-brand-cyan/10 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/20">
                        {scan.scan_type} Threat Audit
                      </span>
                      <span className="text-xs font-mono text-slate-500">ID: {scan.id}</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-white break-all">{scan.target}</h1>
                  </div>

                  <RiskBadge level={scan.risk_level} status={scan.status} size="lg" />
                </div>

                {/* Risk Score & Platform Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1">
                    <RiskScoreDisplay
                      score={scan.risk_score}
                      level={scan.risk_level}
                      status={scan.status}
                    />
                  </div>

                  <div className="md:col-span-2 p-5 rounded-xl bg-cyber-950/80 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-brand-cyan" />
                      Platform Security Recommendation
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-cyber-900 p-3 rounded-lg border border-slate-800">
                      {scan.recommendation}
                    </p>
                  </div>
                </div>

                {/* Advisory Notice Banner */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Beginner Guidance & Security Note</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Risk scores represent internal heuristic evaluations based on known threat patterns. Clean multi-engine API results do not guarantee absolute safety against brand-new zero-day phishing sites. Always verify sender identity directly before submitting credentials.
                  </p>
                </div>

                {/* Findings Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-cyan" />
                    Detected Violation Findings
                  </h3>
                  <FindingList findings={scan.findings} />
                </div>

                {/* Security APIs */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Security API Multi-Engine Results</h3>
                  <SecurityApiBadge apiResults={scan.api_results} />
                </div>

                {/* Technical Inspection Metadata */}
                <TechnicalMetadata
                  metadata={scan.metadata}
                  scanId={scan.id}
                  createdAt={scan.created_at}
                  scanType={scan.scan_type}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
