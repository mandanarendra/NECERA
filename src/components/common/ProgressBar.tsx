import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'emerald' | 'amber' | 'cyan';
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  subLabel,
  size = 'md',
  variant = 'indigo',
  showPercent = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  const colorClasses = {
    indigo: 'from-indigo-600 to-cyan-500',
    emerald: 'from-emerald-600 to-teal-400',
    amber: 'from-amber-600 to-orange-400',
    cyan: 'from-cyan-600 to-blue-400',
  }[variant];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-300">
          <div className="flex items-center gap-2 truncate">
            {label && <span className="text-slate-200 truncate">{label}</span>}
            {subLabel && <span className="text-[11px] text-slate-500 font-normal">{subLabel}</span>}
          </div>
          {showPercent && (
            <span className="font-mono tabular-nums text-slate-400 ml-2 shrink-0">{clamped}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses} transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
