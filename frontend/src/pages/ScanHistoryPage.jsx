import React, { useState, useEffect, useCallback } from 'react';
import { History, RefreshCw, Trash2, ArrowRight, Eye, ShieldAlert, Globe, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import FilterControls from '../components/common/FilterControls.jsx';
import Pagination from '../components/common/Pagination.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmationModal from '../components/common/ConfirmationModal.jsx';
import { getScans, deleteScan } from '../services/scanService.js';
import { formatDate, truncateText } from '../utils/formatters.js';
import { useToast } from '../hooks/useToast.js';

export default function ScanHistoryPage() {
  const { showToast } = useToast();

  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [scanType, setScanType] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Deletion Modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getScans({
        page,
        limit: 10,
        type: scanType,
        riskLevel,
        status,
        search,
      });
      setScans(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: response.data?.length || 0, pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to retrieve scan history.');
    } finally {
      setLoading(false);
    }
  }, [page, scanType, riskLevel, status, search]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleResetFilters = () => {
    setScanType('');
    setRiskLevel('');
    setStatus('');
    setSearch('');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteScan(deleteId);
      showToast('Scan record deleted successfully.', 'success');
      setDeleteId(null);
      fetchHistory();
    } catch (err) {
      showToast('Failed to delete scan: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'url':
        return <Globe className="w-3.5 h-3.5 text-brand-cyan" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1 space-y-6">
            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-brand-cyan" />
                  Scan Telemetry Records
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Complete searchable audit trail of your submitted URLs, emails, and message scans
                </p>
              </div>

              <button
                onClick={fetchHistory}
                disabled={loading}
                className="btn-secondary py-2 px-3 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {/* Search & Filter Controls Card */}
            <div className="glass-card p-4 space-y-3 border-slate-800">
              <div className="flex flex-col md:flex-row gap-3">
                <SearchBar
                  value={search}
                  onChange={(val) => {
                    setSearch(val);
                    setPage(1);
                  }}
                  placeholder="Search scanned targets, URLs, domain names or email subjects..."
                />
              </div>

              <FilterControls
                scanType={scanType}
                setScanType={(val) => {
                  setScanType(val);
                  setPage(1);
                }}
                riskLevel={riskLevel}
                setRiskLevel={(val) => {
                  setRiskLevel(val);
                  setPage(1);
                }}
                status={status}
                setStatus={(val) => {
                  setStatus(val);
                  setPage(1);
                }}
                onReset={handleResetFilters}
              />
            </div>

            {/* Content Table / List */}
            {loading ? (
              <LoadingSpinner message="Retrieving scan telemetry history..." />
            ) : error ? (
              <ErrorMessage title="History Error" message={error} onRetry={fetchHistory} />
            ) : scans.length === 0 ? (
              <EmptyState
                title={search || scanType || riskLevel || status ? 'No Scans Match Filters' : 'No Scan Records Found'}
                description={
                  search || scanType || riskLevel || status
                    ? 'Try clearing active search terms or filter criteria.'
                    : 'Submit your first URL, email, or message scan to build your audit log.'
                }
              />
            ) : (
              <div className="glass-card border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cyber-950/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Target Payload</th>
                        <th className="px-4 py-3">Risk Score</th>
                        <th className="px-4 py-3">Threat Status</th>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[11px] font-semibold text-slate-200">
                              {getTypeIcon(scan.scan_type)}
                              <span>{scan.scan_type}</span>
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-100 max-w-xs sm:max-w-md truncate" title={scan.target}>
                              {truncateText(scan.target, 55)}
                            </div>
                            {scan.normalized_target && (
                              <div className="font-mono text-[10px] text-slate-500 truncate">
                                {scan.normalized_target}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3.5 font-mono font-bold whitespace-nowrap">
                            <span className="text-slate-200">{scan.risk_score}</span>
                            <span className="text-slate-500 font-normal">/100</span>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <RiskBadge level={scan.risk_level} status={scan.status} size="sm" />
                          </td>

                          <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {formatDate(scan.created_at)}
                          </td>

                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/scans/${scan.id}`}
                                className="p-1.5 rounded-lg text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
                                title="View Report"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => setDeleteId(scan.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-800">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.pages}
                    totalItems={pagination.total}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
