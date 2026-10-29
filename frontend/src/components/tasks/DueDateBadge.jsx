import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils';

export default function DueDateBadge({ dueDate, isCompleted = false, size = 'sm' }) {
  if (!dueDate) return null;

  const formatted = formatHumanDate(dueDate);
  if (!formatted) return null;

  let colorClasses = 'text-zinc-500 bg-zinc-100/70 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800';

  if (!isCompleted) {
    if (formatted.isOverdue) {
      colorClasses = 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 font-medium';
    } else if (formatted.isToday) {
      colorClasses = 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 font-medium';
    } else if (formatted.isSoon) {
      colorClasses = 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
    }
  } else {
    colorClasses = 'text-zinc-400 dark:text-zinc-500 bg-transparent border-transparent';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5 gap-1'
    : 'text-xs px-2 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-tight ${colorClasses} ${sizeClasses}`}
      title={new Date(dueDate).toLocaleString()}
    >
      {formatted.isOverdue && !isCompleted ? (
        <AlertCircle className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      ) : (
        <Calendar className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      )}
      <span>{formatted.label}</span>
    </span>
  );
}

