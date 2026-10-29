import React from 'react';
import { ListChecks, MoreHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import DueDateBadge from './DueDateBadge';
import { useTasks } from '../../context/TaskContext';

const columnOrder = ['backlog', 'todo', 'in_progress', 'in_review', 'completed'];

export default function TaskCard({ task, onDragStart }) {
  const { setSelectedTask, updateTask, toggleTaskComplete } = useTasks();

  const isCompleted = task.status === 'completed';
  const taskId = task._id || task.id;

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  const currentIdx = columnOrder.indexOf(task.status);
  const prevStatus = currentIdx > 0 ? columnOrder[currentIdx - 1] : null;
  const nextStatus = currentIdx < columnOrder.length - 1 ? columnOrder[currentIdx + 1] : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, taskId)}
      onClick={() => setSelectedTask(task)}
      className="group relative p-3 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-lg shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 cursor-grab active:cursor-grabbing transition-all space-y-2.5"
    >
      {/* Top row: Priority & Project */}
      <div className="flex items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <PriorityBadge priority={task.priority} size="xs" />
          {task.project && (
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded truncate">
              {task.project}
            </span>
          )}
        </div>

        {/* Quick Shift buttons on hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity"
        >
          {prevStatus && (
            <button
              onClick={() => updateTask(taskId, { status: prevStatus })}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title={`Move to ${prevStatus.replace('_', ' ')}`}
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => updateTask(taskId, { status: nextStatus })}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title={`Move to ${nextStatus.replace('_', ' ')}`}
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h4
        className={`text-xs sm:text-sm font-medium leading-snug line-clamp-2 transition-colors ${
          isCompleted
            ? 'line-through text-zinc-400 dark:text-zinc-500'
            : 'text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white'
        }`}
      >
        {task.title}
      </h4>

      {/* Tags if any */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 px-1.5 py-0.2 rounded border border-zinc-200/50 dark:border-zinc-800/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: Subtasks & Due Date */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
        {totalSubtasks > 0 ? (
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <ListChecks className="w-3 h-3 text-zinc-400" />
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        ) : (
          <div />
        )}

        <DueDateBadge dueDate={task.dueDate} isCompleted={isCompleted} size="xs" />
      </div>
    </div>
  );
}

