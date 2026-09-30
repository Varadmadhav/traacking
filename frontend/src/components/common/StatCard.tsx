import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  colorScheme?: 'orange' | 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
  progress?: number; // 0 to 100
  onClick?: () => void;
  statusBadge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  colorScheme = 'orange',
  progress,
  onClick,
  statusBadge,
}) => {
  const colorMap = {
    orange: {
      border: 'border-orange-500/20 hover:border-orange-500/40',
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      progressBg: 'bg-orange-500',
      textAccent: 'text-orange-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      progressBg: 'bg-amber-500',
      textAccent: 'text-amber-400',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      progressBg: 'bg-emerald-500',
      textAccent: 'text-emerald-400',
    },
    blue: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      progressBg: 'bg-sky-500',
      textAccent: 'text-sky-400',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      progressBg: 'bg-purple-500',
      textAccent: 'text-purple-400',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      progressBg: 'bg-rose-500',
      textAccent: 'text-rose-400',
    },
    slate: {
      border: 'border-dark-700 hover:border-dark-600',
      iconBg: 'bg-dark-800 text-slate-300 border-dark-700',
      progressBg: 'bg-slate-400',
      textAccent: 'text-slate-300',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-dark-900/90 border ${scheme.border} p-4 sm:p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-dark-850 hover:-translate-y-0.5 shadow-card-dark' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
              {value}
            </span>
            {subValue && (
              <span className="text-xs font-medium text-slate-400">
                {subValue}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${scheme.iconBg} shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {statusBadge && (
        <div className="mt-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-dark-800 border border-dark-700 text-slate-300">
            {statusBadge}
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>Progress</span>
            <span className={scheme.textAccent}>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.progressBg}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
