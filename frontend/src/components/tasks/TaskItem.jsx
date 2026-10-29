import React, { useState } from 'react';
import { Check, CheckSquare, Square, Trash2, MoreHorizontal, CheckCircle2, ChevronRight, ListChecks } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import DueDateBadge from './DueDateBadge';
import StatusBadge from './StatusBadge';
import { useTasks } from '../../context/TaskContext';

export default function TaskItem({ task }) {
  const { toggleTaskComplete, setSelectedTask, deleteTask, updateTask } = useTasks();
  const [isHovered, setIsHovered] = useState(false);

  const isCompleted = task.status === 'completed';
  const taskId = task._id || task.id;

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-center justify-between px-3.5 py-3 rounded-lg border transition-all ${
        isCompleted
          ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-500'
          : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-subtle'
      }`}
    >
      {/* Left section: Checkbox + Title + Meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Tactile Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task);
          }}
          className={`shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-zinc-800'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* Task Title & Project */}
        <div
          onClick={() => setSelectedTask(task)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-medium transition-colors truncate ${
                isCompleted
                  ? 'line-through text-zinc-400 dark:text-zinc-500 font-normal'
                  : 'text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white'
              }`}
            >
              {task.title}
            </span>

            {/* Checklist progress badge */}
            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
                <ListChecks className="w-3 h-3 text-zinc-400" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </span>
            )}
          </div>

          {/* Subtitle / tags on mobile or subtle */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1 sm:hidden">
              {task.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Badges & Controls */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {/* Project Chip */}
        {task.project && (
          <span className="hidden md:inline-flex text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
            {task.project}
          </span>
        )}

        {/* Due Date */}
        <DueDateBadge dueDate={task.dueDate} isCompleted={isCompleted} size="xs" />

        {/* Priority */}
        <PriorityBadge priority={task.priority} size="xs" />

        {/* Hover quick delete / details */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedTask(task)}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Open details"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(taskId);
            }}
            className="p-1 text-zinc-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

