import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Analyzing threat indicators...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-xl animate-pulse" />
        <Shield className="w-12 h-12 text-brand-cyan animate-pulse" />
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin absolute -inset-2" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-200 tracking-wide">{message}</p>
        <p className="text-xs text-slate-500 font-mono">Running local heuristics & API correlation checks...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-cyber-950 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
