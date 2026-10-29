import React, { useState } from 'react';
import { Plus, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function QuickAddTask({ defaultStatus = 'todo', placeholder = 'Add a task... Press Enter to create' }) {
  const { createTask, activeProject } = useTasks();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: cleanTitle,
        status: defaultStatus,
        priority: 'medium',
        project: activeProject !== 'all' ? activeProject : 'Core App',
        dueDate: defaultStatus === 'todo' ? new Date().toISOString() : null,
      });
      setTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:border-solid transition-colors"
    >
      <Plus className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors shrink-0" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="w-full text-xs sm:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
      />
      {title.trim().length > 0 && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <span>Add</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      )}
    </form>
  );
}

