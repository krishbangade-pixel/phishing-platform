import React from 'react';
import { ShieldAlert, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No Scans Recorded',
  description = 'You have not submitted any URLs, emails, or messages for phishing analysis yet.',
  actionLink = '/scan/url',
  actionText = 'Start First Scan',
  icon: Icon = ShieldAlert,
}) {
  return (
    <div className="p-10 rounded-2xl glass-card text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-8 border-dashed border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-cyber-950 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
        <Icon className="w-8 h-8 text-brand-cyan" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{description}</p>
      </div>

      {actionLink && actionText && (
        <div className="pt-2">
          <Link to={actionLink} className="btn-primary text-sm py-2.5 px-4">
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
