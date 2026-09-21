import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { getRiskColorClass } from '../../utils/formatters.js';

export default function RiskBadge({ level, status, size = 'md', showIcon = true }) {
  const styles = getRiskColorClass(level, status);
  
  // Custom label map to adhere strictly to non-misleading safety wording
  let displayLabel = status || level || 'Unknown';
  if ((status || '').toLowerCase() === 'safe' || (level || '').toLowerCase() === 'low') {
    displayLabel = 'No Known Threats';
  } else if ((status || '').toLowerCase() === 'suspicious') {
    displayLabel = 'Potentially Suspicious';
  } else if ((status || '').toLowerCase() === 'malicious') {
    displayLabel = 'Malicious Threat';
  }

  const renderIcon = () => {
    const norm = (displayLabel || '').toLowerCase();
    if (norm.includes('malicious')) return <ShieldAlert className="w-4 h-4 shrink-0" />;
    if (norm.includes('suspicious')) return <AlertTriangle className="w-4 h-4 shrink-0" />;
    if (norm.includes('no known')) return <ShieldCheck className="w-4 h-4 shrink-0" />;
    return <Info className="w-4 h-4 shrink-0" />;
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-medium gap-1',
    md: 'text-sm px-3 py-1 font-semibold gap-1.5',
    lg: 'text-base px-4 py-1.5 font-bold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && renderIcon()}
      <span>{displayLabel}</span>
    </span>
  );
}
