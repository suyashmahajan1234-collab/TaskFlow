import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Sparkles, Plus } from 'lucide-react';
import TaskItem from './TaskItem';
import QuickAddTask from './QuickAddTask';
import { useTasks } from '../../context/TaskContext';

const sectionOrder = [
  { id: 'in_progress', title: 'In Progress', dot: 'bg-blue-500' },
  { id: 'todo', title: 'To Do', dot: 'bg-amber-500' },
  { id: 'in_review', title: 'In Review', dot: 'bg-purple-500' },
  { id: 'backlog', title: 'Backlog', dot: 'bg-zinc-400' },
  { id: 'completed', title: 'Completed', dot: 'bg-emerald-500' },
];

export default function TaskList() {
  const { filteredTasks, setIsNewTaskOpen, setNewTaskInitialStatus } = useTasks();
  const [collapsedSections, setCollapsedSections] = useState({
    completed: true, // Collapsed by default for a clean workspace
  });

  const toggleSection = (sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Group tasks by status
  const grouped = sectionOrder.reduce((acc, sec) => {
    acc[sec.id] = filteredTasks.filter((t) => t.status === sec.id);
    return acc;
  }, {});

  const totalFiltered = filteredTasks.length;

  if (totalFiltered === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No tasks found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
          There are no tasks matching your current filters. Clear the search or create a new task to get rolling.
        </p>
        <button
          onClick={() => {
            setNewTaskInitialStatus('todo');
            setIsNewTaskOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top quick add */}
      <QuickAddTask defaultStatus="todo" placeholder="Add a new task to To Do... Press Enter to save" />

      {/* Grouped Sections */}
      {sectionOrder.map((section) => {
        const tasksInSection = grouped[section.id] || [];
        const isCollapsed = collapsedSections[section.id];

        // If completed section has 0 tasks and is collapsed, skip or show empty
        if (tasksInSection.length === 0 && section.id === 'completed') return null;

        return (
          <div key={section.id} className="space-y-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between py-1.5 px-1 text-left group"
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                )}
                <div className={`w-2 h-2 rounded-full ${section.dot}`} />
                <span className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 uppercase">
                  {section.title}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {tasksInSection.length}
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setNewTaskInitialStatus(section.id);
                  setIsNewTaskOpen(true);
                }}
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded transition-opacity"
                title={`Add to ${section.title}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Tasks list */}
            {!isCollapsed && (
              <div className="space-y-1.5 pl-1">
                {tasksInSection.length === 0 ? (
                  <div className="py-2.5 px-3 text-[11px] text-zinc-400 italic bg-zinc-50/50 dark:bg-zinc-900/30 rounded border border-dashed border-zinc-200 dark:border-zinc-800/80">
                    No tasks in {section.title.toLowerCase()}.
                  </div>
                ) : (
                  tasksInSection.map((task) => (
                    <TaskItem key={task._id || task.id} task={task} />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

