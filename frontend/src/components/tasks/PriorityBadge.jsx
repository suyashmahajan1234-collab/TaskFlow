import React from 'react';
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const priorityConfig = {
  urgent: {
    label: 'Urgent',
    icon: AlertCircle,
    styles: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    dot: 'bg-rose-500',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    styles: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    dot: 'bg-amber-500',
  },
  medium: {
    label: 'Medium',
    icon: ArrowRight,
    styles: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    dot: 'bg-blue-500',
  },
  low: {
    label: 'Low',
    icon: ArrowDown,
    styles: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    dot: 'bg-zinc-400',
  },
};

export default function PriorityBadge({ priority = 'medium', showIcon = true, size = 'sm' }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-1.5 py-0.5 gap-1' 
    : 'text-xs px-2 py-0.5 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide transition-colors ${config.styles} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      <span>{config.label}</span>
    </span>
  );
}

