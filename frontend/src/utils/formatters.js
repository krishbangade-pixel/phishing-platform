/**
 * Format ISO Date string into friendly readable format
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

/**
 * Truncate long URLs or text strings cleanly
 */
export function truncateText(text, maxLength = 45) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Map risk level to consistent tailwind badge color styles
 */
export function getRiskColorClass(level, status) {
  const normLevel = (level || '').toLowerCase();
  const normStatus = (status || '').toLowerCase();

  if (normStatus === 'malicious' || normLevel === 'critical' || normLevel === 'high') {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-500',
      glow: 'shadow-glow-rose/20',
      barColor: '#ef4444'
    };
  }

  if (normStatus === 'suspicious' || normLevel === 'medium') {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-500',
      glow: 'shadow-glow-amber/20',
      barColor: '#f59e0b'
    };
  }

  if (normLevel === 'low') {
    return {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500',
      glow: 'shadow-glow-cyan/20',
      barColor: '#06b6d4'
    };
  }

  // Safe / No threats detected
  return {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500',
    glow: 'shadow-glow-emerald/20',
    barColor: '#10b981'
  };
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
