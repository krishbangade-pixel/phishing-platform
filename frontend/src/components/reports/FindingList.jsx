import React from 'react';
import { AlertCircle, AlertOctagon, ShieldAlert, CheckCircle } from 'lucide-react';

export default function FindingList({ findings = [] }) {
  if (!findings || findings.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
        <div className="text-sm font-medium">
          No suspicious rule violations or heuristic threat patterns were detected in this analysis.
        </div>
      </div>
    );
  }

  const severityBadgeClass = (severity) => {
    const s = (severity || 'low').toLowerCase();
    switch (s) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const severityIcon = (severity) => {
    const s = (severity || 'low').toLowerCase();
    if (s === 'critical' || s === 'high') {
      return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
    }
    if (s === 'medium') {
      return <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
    }
    return <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;
  };

  return (
    <div className="space-y-3">
      {findings.map((item, index) => {
        // Handle string findings or object findings
        const title = typeof item === 'string' ? item : (item.title || item.rule || `Finding #${index + 1}`);
        const description = typeof item === 'object' ? item.description : null;
        const severity = typeof item === 'object' ? (item.severity || 'medium') : 'medium';
        const weight = typeof item === 'object' ? item.weight : null;

        return (
          <div
            key={index}
            className="p-4 rounded-xl bg-cyber-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {severityIcon(severity)}
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {title}
                  </h4>
                  {description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[11px] uppercase font-mono font-semibold px-2.5 py-0.5 rounded-md border ${severityBadgeClass(
                    severity
                  )}`}
                >
                  {severity}
                </span>
                {weight !== null && weight !== undefined && (
                  <span className="text-[10px] font-mono text-slate-500">
                    +{weight}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
