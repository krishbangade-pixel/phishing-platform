import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, MessageSquare, ShieldAlert, ShieldCheck, AlertTriangle, Activity, ArrowRight, RefreshCw, PlusCircle, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ScanCard from '../components/scanning/ScanCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmationModal from '../components/common/ConfirmationModal.jsx';
import { getScans, deleteScan } from '../services/scanService.js';
import { useToast } from '../hooks/useToast.js';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getScans({ page: 1, limit: 20 });
      setScans(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: response.data?.length || 0, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch dashboard scan history:', err);
      setError(err.message || 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteScan(deleteTargetId);
      showToast('Scan record deleted successfully.', 'success');
      setScans((prev) => prev.filter((s) => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      showToast('Deletion failed: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Calculate real metrics from fetched data
  const totalScans = pagination.total || scans.length;
  const urlScansCount = scans.filter((s) => s.scan_type === 'url').length;
  const emailScansCount = scans.filter((s) => s.scan_type === 'email').length;
  const messageScansCount = scans.filter((s) => s.scan_type === 'message').length;

  const safeCount = scans.filter((s) => (s.status || '').toLowerCase() === 'safe' || (s.risk_level || '').toLowerCase() === 'low').length;
  const suspiciousCount = scans.filter((s) => (s.status || '').toLowerCase() === 'suspicious' || (s.risk_level || '').toLowerCase() === 'medium').length;
  const maliciousCount = scans.filter((s) => (s.status || '').toLowerCase() === 'malicious' || ['high', 'critical'].includes((s.risk_level || '').toLowerCase())).length;

  const pieData = [
    { name: 'No Known Threat', value: safeCount, color: '#10b981' },
    { name: 'Suspicious', value: suspiciousCount, color: '#f59e0b' },
    { name: 'Malicious', value: maliciousCount, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1 space-y-8">
            {/* Header & Quick Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-brand-cyan" />
                  Threat Defense Dashboard
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time threat analytics and recent scan telemetry
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="btn-secondary py-2 px-3 text-xs"
                  title="Refresh telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <Link to="/scan/url" className="btn-primary py-2 px-4 text-xs">
                  <PlusCircle className="w-4 h-4" />
                  <span>New Scan</span>
                </Link>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching dashboard scan telemetry..." />
            ) : error ? (
              <ErrorMessage title="Backend Connection Issue" message={error} onRetry={fetchDashboardData} />
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Total Scans */}
                  <div className="glass-card p-4 space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Total Scans
                    </span>
                    <div className="text-2xl font-extrabold text-white font-mono">{totalScans}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Account Telemetry</div>
                  </div>

                  {/* URL Scans */}
                  <div className="glass-card p-4 space-y-1 border-brand-cyan/30">
                    <span className="text-[11px] font-mono text-brand-cyan uppercase tracking-wider block flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> URL Scans
                    </span>
                    <div className="text-2xl font-extrabold text-brand-cyan font-mono">{urlScansCount}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Domain Audits</div>
                  </div>

                  {/* Email Scans */}
                  <div className="glass-card p-4 space-y-1 border-blue-500/30">
                    <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Email Scans
                    </span>
                    <div className="text-2xl font-extrabold text-blue-400 font-mono">{emailScansCount}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Payload Audits</div>
                  </div>

                  {/* Message Scans */}
                  <div className="glass-card p-4 space-y-1 border-purple-500/30">
                    <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Message Scans
                    </span>
                    <div className="text-2xl font-extrabold text-purple-400 font-mono">{messageScansCount}</div>
                    <div className="text-[10px] text-slate-500 font-mono">SMS / Chat Scans</div>
                  </div>
                </div>

                {/* Threat Distribution Chart & Quick Launchers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recharts Pie Chart */}
                  <div className="glass-card p-5 space-y-4 lg:col-span-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">Threat Distribution</h3>
                      <span className="text-[10px] font-mono text-slate-500">Live Breakdown</span>
                    </div>

                    {pieData.length > 0 ? (
                      <div className="h-44 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b0f19" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0b0f19',
                                borderColor: '#334155',
                                borderRadius: '8px',
                                fontSize: '12px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-44 flex items-center justify-center text-xs text-slate-500 italic">
                        No scan telemetry data available yet.
                      </div>
                    )}

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          No Known Threats
                        </span>
                        <span>{safeCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Suspicious
                        </span>
                        <span>{suspiciousCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-rose-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                          Malicious
                        </span>
                        <span>{maliciousCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Modules */}
                  <div className="glass-card p-5 space-y-4 lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-200">Launch Security Analyzer</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Link
                        to="/scan/url"
                        className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 hover:border-brand-cyan/50 hover:bg-cyber-900 transition-all group space-y-2"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                          <Search className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-brand-cyan">URL Scanner</h4>
                        <p className="text-[11px] text-slate-400">Inspect web domains & SSL certificates</p>
                      </Link>

                      <Link
                        to="/scan/email"
                        className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 hover:border-blue-400/50 hover:bg-cyber-900 transition-all group space-y-2"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-blue-400">Email Analyzer</h4>
                        <p className="text-[11px] text-slate-400">Evaluate headers, panic lures & links</p>
                      </Link>

                      <Link
                        to="/scan/message"
                        className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 hover:border-purple-400/50 hover:bg-cyber-900 transition-all group space-y-2"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-400">SMS / Chat Scan</h4>
                        <p className="text-[11px] text-slate-400">Scan smishing & fake delivery texts</p>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recent Scans Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">Recent Telemetry Audits</h2>
                    <Link
                      to="/scans"
                      className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                    >
                      <span>View All History ({totalScans})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {scans.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scans.slice(0, 6).map((scan) => (
                        <ScanCard key={scan.id} scan={scan} onDelete={(id) => setDeleteTargetId(id)} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
