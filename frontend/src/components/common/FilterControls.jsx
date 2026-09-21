import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterControls({
  scanType,
  setScanType,
  riskLevel,
  setRiskLevel,
  status,
  setStatus,
  onReset,
}) {
  const isFiltered = scanType || riskLevel || status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Scan Type Filter */}
      <div className="flex items-center gap-1.5 bg-cyber-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
        <Filter className="w-3.5 h-3.5 text-brand-cyan" />
        <span className="text-slate-400">Type:</span>
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-cyber-900">All Types</option>
          <option value="url" className="bg-cyber-900">URL Scans</option>
          <option value="email" className="bg-cyber-900">Email Analysis</option>
          <option value="message" className="bg-cyber-900">Message / SMS</option>
        </select>
      </div>

      {/* Risk Level Filter */}
      <div className="flex items-center gap-1.5 bg-cyber-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
        <span className="text-slate-400">Risk Level:</span>
        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-cyber-900">All Levels</option>
          <option value="Low" className="bg-cyber-900">Low Risk</option>
          <option value="Medium" className="bg-cyber-900">Medium Risk</option>
          <option value="High" className="bg-cyber-900">High Risk</option>
          <option value="Critical" className="bg-cyber-900">Critical Risk</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 bg-cyber-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
        <span className="text-slate-400">Threat Status:</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-cyber-900">All Statuses</option>
          <option value="Safe" className="bg-cyber-900">No Known Threat</option>
          <option value="Suspicious" className="bg-cyber-900">Suspicious</option>
          <option value="Malicious" className="bg-cyber-900">Malicious</option>
        </select>
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          className="btn-secondary py-1.5 px-3 text-xs text-slate-400 hover:text-slate-200"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
