import React, { useState } from 'react';
import { X, Calendar, Plus, Tag, Folder } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function NewTaskModal() {
  const {
    isNewTaskOpen,
    setIsNewTaskOpen,
    newTaskInitialStatus,
    createTask,
    projects,
    activeProject,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(newTaskInitialStatus || 'todo');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState(activeProject !== 'all' ? activeProject : 'Engineering');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isNewTaskOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        project,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tags,
      });
      setIsNewTaskOpen(false);
      // Reset
      setTitle('');
      setDescription('');
      setTags([]);
      setDueDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => setIsNewTaskOpen(false)} />

      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-modal border border-zinc-200 dark:border-zinc-800 z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Create New Task
          </h3>
          <button
            onClick={() => setIsNewTaskOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full text-base font-medium bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description or notes (optional)..."
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none resize-none"
            />
          </div>

          {/* Properties row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Status */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="backlog">Backlog</option>
                <option value="completed">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Workspace */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Workspace
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p._id || p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 uppercase font-medium block">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
                >
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X className="w-3 h-3 text-zinc-400 hover:text-rose-500" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ tag (press Enter)"
                className="text-xs px-2 py-1 bg-transparent text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none w-32"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

