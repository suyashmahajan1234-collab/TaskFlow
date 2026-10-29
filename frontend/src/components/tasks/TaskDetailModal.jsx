import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Tag,
  Clock,
  Folder,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { useTasks } from '../../context/TaskContext';
import { toInputDateFormat } from '../../utils/dateUtils';

export default function TaskDetailModal() {
  const {
    selectedTask,
    setSelectedTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    projects,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('Engineering');
  const [dueDate, setDueDate] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status || 'todo');
      setPriority(selectedTask.priority || 'medium');
      setProject(selectedTask.project || 'Engineering');
      setDueDate(toInputDateFormat(selectedTask.dueDate));
      setTags(selectedTask.tags || []);
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  const taskId = selectedTask._id || selectedTask.id;

  const handleSaveField = async (field, value) => {
    try {
      await updateTask(taskId, { [field]: value });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(taskId, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = newTagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        const nextTags = [...tags, cleanTag];
        setTags(nextTags);
        handleSaveField('tags', nextTags);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setTags(nextTags);
    handleSaveField('tags', nextTags);
  };

  const subtasks = selectedTask.subtasks || [];
  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setSelectedTask(null)} />

      {/* Slide-over Sheet */}
      <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-modal flex flex-col z-10 animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">
              TASK-{taskId.toString().slice(-4).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteTask(taskId)}
              className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Title input */}
          <div>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleSaveField('title', title.trim())}
              placeholder="Task title..."
              className="w-full text-lg sm:text-xl font-bold bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none"
            />
          </div>

          {/* Properties Meta Grid */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-100 dark:border-zinc-800/80 text-xs">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  handleSaveField('status', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  handleSaveField('priority', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Workspace / Project */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                Workspace
              </label>
              <select
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  handleSaveField('project', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                {projects.map((p) => (
                  <option key={p._id || p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                Due Date
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    handleSaveField('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
                />
                {dueDate && (
                  <button
                    onClick={() => {
                      setDueDate('');
                      handleSaveField('dueDate', null);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    title="Clear date"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleSaveField('description', description.trim())}
              placeholder="Add details, context, technical notes..."
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-y"
            />
          </div>

          {/* Subtasks / Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Checklist Items
                </label>
                {subtasks.length > 0 && (
                  <span className="text-[11px] font-mono text-zinc-400">
                    {completedCount}/{subtasks.length} ({progressPercent}%)
                  </span>
                )}
              </div>
            </div>

            {subtasks.length > 0 && (
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            <div className="space-y-1.5">
              {subtasks.map((st) => {
                const subId = st._id || st.id;
                return (
                  <div
                    key={subId}
                    onClick={() => toggleSubtask(taskId, subId)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs flex-1 ${
                        st.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add subtask inline */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a checklist item... Press Enter"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 disabled:opacity-40 transition-opacity"
              >
                Add
              </button>
            </form>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Labels / Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ tag (↵ to add)"
                className="px-2 py-1 text-xs bg-transparent text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none w-28"
              />
            </div>
          </div>

          {/* Activity Log */}
          {selectedTask.activityLog && selectedTask.activityLog.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Activity History
              </label>
              <div className="space-y-2">
                {selectedTask.activityLog.map((log, index) => (
                  <div key={index} className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <span>{log.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

