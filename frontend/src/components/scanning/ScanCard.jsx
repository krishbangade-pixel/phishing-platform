import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import RiskBadge from '../common/RiskBadge.jsx';
import { formatDate, truncateText } from '../../utils/formatters.js';

export default function ScanCard({ scan, onDelete }) {
  const { id, scan_type, target, risk_score, risk_level, status, created_at } = scan;

  const typeIcons = {
    url: Globe,
    email: Mail,
    message: MessageSquare,
  };

  const IconComponent = typeIcons[scan_type] || Globe;

  return (
    <div className="glass-card-hover p-5 flex flex-col justify-between gap-4 group">
      <div className="space-y-3">
        {/* Header with Type badge and Risk Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-semibold text-brand-cyan bg-brand-cyan/10 px-2.5 py-1 rounded-md border border-brand-cyan/20">
            <IconComponent className="w-3.5 h-3.5" />
            <span>{scan_type} Scan</span>
          </span>

          <RiskBadge level={risk_level} status={status} size="sm" />
        </div>

        {/* Target display */}
        <div>
          <div className="text-xs text-slate-500 font-mono mb-1">Scanned Target</div>
          <p className="text-sm font-semibold text-slate-100 break-all leading-snug">
            {truncateText(target, 70)}
          </p>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div>
            Score: <span className="font-mono font-bold text-slate-200">{risk_score}/100</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="font-mono text-[11px] text-slate-500">
            {formatDate(created_at)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Scan Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Link
            to={`/scans/${id}`}
            className="btn-secondary py-1 px-2.5 text-xs text-brand-cyan hover:text-cyan-300 group-hover:border-brand-cyan/50 transition-all"
          >
            <span>Report</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
