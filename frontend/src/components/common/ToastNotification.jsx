import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  const { type, message } = toast;

  const config = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/90 text-emerald-200',
      iconColor: 'text-emerald-400',
    },
    error: {
      icon: XCircle,
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/90 text-rose-200',
      iconColor: 'text-rose-400',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/90 text-amber-200',
      iconColor: 'text-amber-400',
    },
    info: {
      icon: Info,
      border: 'border-cyan-500/40',
      bg: 'bg-cyber-900/95 text-cyan-200',
      iconColor: 'text-brand-cyan',
    },
  };

  const style = config[type] || config.info;
  const IconComponent = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${style.border} ${style.bg} backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 p-1 transition-colors rounded-lg"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
