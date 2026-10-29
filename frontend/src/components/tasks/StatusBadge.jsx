import React from 'react';
import { Circle, Clock, CheckCircle2, Eye, Archive } from 'lucide-react';

const statusConfig = {
  backlog: {
    label: 'Backlog',
    icon: Archive,
    styles: 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
  },
  todo: {
    label: 'To Do',
    icon: Circle,
    styles: 'text-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    styles: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
  },
  in_review: {
    label: 'In Review',
    icon: Eye,
    styles: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
  },
  completed: {
    label: 'Done',
    icon: CheckCircle2,
    styles: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
  },
};

export default function StatusBadge({ status = 'todo', size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.todo;
  const Icon = config.icon;

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5 gap-1'
    : 'text-xs px-2 py-0.5 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-tight ${config.styles} ${sizeClasses}`}
    >
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{config.label}</span>
    </span>
  );
}

