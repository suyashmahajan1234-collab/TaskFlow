import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Flame, ArrowUpRight } from 'lucide-react';
import TaskItem from './TaskItem';
import QuickAddTask from './QuickAddTask';
import { useTasks } from '../../context/TaskContext';
import { formatHumanDate } from '../../utils/dateUtils';

export default function TodayView() {
  const { filteredTasks } = useTasks();

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Filter tasks that are due today, overdue, or urgent/high priority
  const todayTasks = filteredTasks.filter((task) => {
    if (!task.dueDate) {
      return task.priority === 'urgent' && task.status !== 'completed';
    }
    const info = formatHumanDate(task.dueDate);
    if (!info) return false;
    return info.isToday || info.isOverdue || (task.priority === 'urgent' && task.status !== 'completed');
  });

  const completedToday = todayTasks.filter((t) => t.status === 'completed').length;
  const pendingCount = todayTasks.length - completedToday;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Date Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Focus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {dateFormatted}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {pendingCount === 0 && todayTasks.length > 0
              ? '🎉 All tasks finished for today! Nice work.'
              : `${pendingCount} item${pendingCount === 1 ? '' : 's'} scheduled for today`}
          </p>
        </div>

        {/* Progress ring or bar */}
        {todayTasks.length > 0 && (
          <div className="flex items-center gap-3 sm:border-l sm:border-zinc-200 dark:sm:border-zinc-800 sm:pl-6">
            <div className="w-24 sm:w-32">
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add for today */}
      <QuickAddTask defaultStatus="todo" placeholder="Add a task for today... Press Enter" />

      {/* Task List */}
      <div className="space-y-2">
        {todayTasks.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Clear runway today
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
              No pending tasks due today or marked urgent. Pick items from your backlog or enjoy the breathing room.
            </p>
          </div>
        ) : (
          todayTasks.map((task) => (
            <TaskItem key={task._id || task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

