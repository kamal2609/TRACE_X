import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';
import { RiskBand } from '../../types';

interface RiskBadgeProps {
  band: RiskBand | 'CRITICAL';
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ band, score, size = 'md' }) => {
  let bg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let icon = <ShieldCheck className="w-3.5 h-3.5" />;
  let label = 'LOW RISK';

  if (band === 'CRITICAL' || (score !== undefined && score >= 85)) {
    bg = 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm shadow-rose-950';
    icon = <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-rose-400" />;
    label = 'CRITICAL RISK';
  } else if (band === 'HIGH') {
    bg = 'bg-red-500/15 text-red-400 border-red-500/40';
    icon = <AlertCircle className="w-3.5 h-3.5" />;
    label = 'HIGH RISK';
  } else if (band === 'REVIEW') {
    bg = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    icon = <AlertTriangle className="w-3.5 h-3.5" />;
    label = 'UNDER REVIEW';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 gap-1' 
    : size === 'lg'
    ? 'text-sm px-3 py-1.5 gap-2'
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-medium rounded-full border ${bg} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
      {score !== undefined && (
        <span className="opacity-90 font-bold ml-0.5">({score})</span>
      )}
    </span>
  );
};
