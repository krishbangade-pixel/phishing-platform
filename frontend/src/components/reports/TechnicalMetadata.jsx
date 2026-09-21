import React from 'react';
import { Terminal, Globe, Server, Calendar, Hash } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

export default function TechnicalMetadata({ metadata, scanId, createdAt, scanType }) {
  if (!metadata && !scanId) return null;

  return (
    <div className="p-5 rounded-xl bg-cyber-950/90 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-brand-cyan uppercase tracking-wider">
        <Terminal className="w-4 h-4" />
        Technical Inspection Metadata
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
        {scanId && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Scan ID</span>
            <span className="text-slate-200 select-all font-semibold break-all">{scanId}</span>
          </div>
        )}

        {createdAt && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Timestamp</span>
            <span className="text-slate-200">{formatDate(createdAt)}</span>
          </div>
        )}

        {metadata?.ipAddress && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Host IP Address</span>
            <span className="text-brand-cyan">{metadata.ipAddress}</span>
          </div>
        )}

        {metadata?.registrar && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Domain Registrar</span>
            <span className="text-slate-200 truncate block">{metadata.registrar}</span>
          </div>
        )}

        {metadata?.sender && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80 col-span-1 sm:col-span-2">
            <span className="text-slate-500 block text-[10px] uppercase">Envelope Sender</span>
            <span className="text-slate-200 truncate block">{metadata.sender}</span>
          </div>
        )}

        {metadata?.extractedUrls && metadata.extractedUrls.length > 0 && (
          <div className="p-3 rounded-lg bg-cyber-900 border border-slate-800/80 col-span-1 sm:col-span-2 md:col-span-3">
            <span className="text-slate-500 block text-[10px] uppercase mb-1">Extracted Payload Links</span>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {metadata.extractedUrls.map((url, i) => (
                <div key={i} className="text-amber-300 hover:underline break-all bg-cyber-950 p-1.5 rounded border border-slate-800">
                  {url}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
