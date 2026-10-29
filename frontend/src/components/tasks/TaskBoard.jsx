import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../../context/TaskContext';

const columns = [
  { id: 'backlog', title: 'Backlog', dot: 'bg-zinc-400' },
  { id: 'todo', title: 'To Do', dot: 'bg-amber-500' },
  { id: 'in_progress', title: 'In Progress', dot: 'bg-blue-500' },
  { id: 'in_review', title: 'In Review', dot: 'bg-purple-500' },
  { id: 'completed', title: 'Done', dot: 'bg-emerald-500' },
];

export default function TaskBoard() {
  const { filteredTasks, updateTask, setIsNewTaskOpen, setNewTaskInitialStatus, createTask, activeProject } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);
  const [quickInputCol, setQuickInputCol] = useState(null);
  const [quickTitle, setQuickTitle] = useState('');

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (activeDropColumn === columnId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    await updateTask(taskId, { status: columnId });
    setDraggedTaskId(null);
  };

  const handleQuickAdd = async (columnId) => {
    if (!quickTitle.trim()) {
      setQuickInputCol(null);
      return;
    }

    try {
      await createTask({
        title: quickTitle.trim(),
        status: columnId,
        priority: 'medium',
        project: activeProject !== 'all' ? activeProject : 'Core App',
        dueDate: columnId === 'todo' ? new Date().toISOString() : null,
      });
      setQuickTitle('');
      setQuickInputCol(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-8 pt-1 min-h-[calc(100vh-12rem)] items-start">
      {columns.map((col) => {
        const tasksInCol = filteredTasks.filter((t) => t.status === col.id);
        const isTarget = activeDropColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`w-72 shrink-0 flex flex-col rounded-xl p-2.5 transition-colors ${
              isTarget
                ? 'bg-zinc-100/90 dark:bg-zinc-800/80 ring-2 ring-emerald-500/50'
                : 'bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1.5 py-1 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {col.title}
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  {tasksInCol.length}
                </span>
              </div>

              <button
                onClick={() => {
                  setQuickInputCol(col.id);
                  setQuickTitle('');
                }}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick add inline inside column */}
            {quickInputCol === col.id && (
              <div className="mb-2.5 p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm">
                <input
                  type="text"
                  autoFocus
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd(col.id);
                    if (e.key === 'Escape') setQuickInputCol(null);
                  }}
                  placeholder="Task title... ↵ save, Esc cancel"
                  className="w-full text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                />
              </div>
            )}

            {/* Cards container */}
            <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-16rem)] pr-0.5">
              {tasksInCol.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-lg">
                  No tasks here
                </div>
              ) : (
                tasksInCol.map((task) => (
                  <TaskCard
                    key={task._id || task.id}
                    task={task}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

