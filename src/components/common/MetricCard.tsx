import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  alert?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive,
  alert,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all ${
        alert
          ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
          : 'bg-slatebg-card/70 border-slatebg-border/60 hover:border-cyan-500/40'
      } ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-cyan-950/20' : ''}`}
    >
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-xs uppercase tracking-wider font-medium text-forensic-muted">{title}</span>
        {icon && <div className="text-cyan-400">{icon}</div>}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono tracking-tight text-white">{value}</div>
        {trend && (
          <span
            className={`text-xs font-mono font-medium ${
              trendPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{subtitle}</p>}
    </div>
  );
};
