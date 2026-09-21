import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ title = 'Action Failed', message, onRetry }) {
  return (
    <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 glass-card space-y-4 max-w-xl mx-auto my-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-bold text-rose-300">{title}</h3>
          <p className="text-sm text-rose-200/90 mt-1 leading-relaxed">
            {message || 'An unexpected error occurred while communicating with the backend API service.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-end">
          <button onClick={onRetry} className="btn-danger text-xs py-2 px-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
