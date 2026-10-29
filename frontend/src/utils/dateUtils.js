export const formatHumanDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Today', isOverdue: false, isToday: true, isSoon: true };
  } else if (diffDays === 1) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false, isSoon: true };
  } else if (diffDays === -1) {
    return { label: 'Yesterday', isOverdue: true, isToday: false, isSoon: false };
  } else if (diffDays < -1) {
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false, isSoon: false };
  } else if (diffDays <= 7) {
    return { label: `In ${diffDays}d`, isOverdue: false, isToday: false, isSoon: true };
  }

  // Format month and day e.g. "Nov 12"
  const options = { month: 'short', day: 'numeric' };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  return {
    label: date.toLocaleDateString(undefined, options),
    isOverdue: false,
    isToday: false,
    isSoon: false,
  };
};

export const toInputDateFormat = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toISOString().split('T')[0];
};

