import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SecurityApiBadge({ apiResults }) {
  if (!apiResults || Object.keys(apiResults).length === 0) {
    return (
      <div className="text-xs text-slate-500 italic">
        External security API indicators were not returned for this query.
      </div>
    );
  }

  const { googleSafeBrowsing, virusTotal } = apiResults;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Google Safe Browsing */}
      <div className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Google Safe Browsing</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                googleSafeBrowsing?.listed
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {googleSafeBrowsing?.listed ? 'FLAGGED THREAT' : 'NOT FLAGGED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {googleSafeBrowsing?.listed
              ? `Flagged as: ${googleSafeBrowsing.threatType || 'Social Engineering / Phishing'}`
              : 'Target is not currently listed in Google Safe Browsing phish database.'}
          </p>
        </div>
      </div>

      {/* VirusTotal */}
      <div className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">VirusTotal Multi-Engine</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                (virusTotal?.detectedCount || 0) > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {virusTotal?.detectedCount || 0} / {virusTotal?.totalEngineCount || 90} ENGINES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {(virusTotal?.detectedCount || 0) > 0
              ? `${virusTotal.detectedCount} security vendors flagged this destination as malicious or suspicious.`
              : 'No security vendors flagged this item on VirusTotal.'}
          </p>
        </div>
      </div>
    </div>
  );
}
