import React from 'react';
import { getRiskColorClass } from '../../utils/formatters.js';

export default function RiskScoreDisplay({ score = 0, level = 'Low', status = 'Safe' }) {
  const styles = getRiskColorClass(level, status);
  const clampedScore = Math.min(100, Math.max(0, Number(score) || 0));

  // Circular gauge parameters
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-15 blur-2xl pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: styles.barColor }}
      />

      <div className="relative w-36 h-36 flex items-center justify-center mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={styles.barColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Risk Index
          </span>
        </div>
      </div>

      <div className="text-center">
        <div className={`text-base font-bold ${styles.text}`}>
          {level} Risk Indicator
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Internal threat analysis rating based on active heuristic indicators.
        </p>
      </div>
    </div>
  );
}
