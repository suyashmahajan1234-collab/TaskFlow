import React, { useState } from 'react';
import {
  ListTodo,
  Kanban,
  Calendar,
  BarChart2,
  Folder,
  Plus,
  CheckCircle2,
  Sun,
  Moon,
  Command,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function Sidebar({ isOpen, onClose }) {
  const {
    activeView,
    setActiveView,
    projects,
    activeProject,
    setActiveProject,
    isDarkMode,
    toggleDarkMode,
    setIsNewTaskOpen,
    setIsCommandPaletteOpen,
    tasks,
    createProject,
  } = useTasks();

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setIsAddingProject(false);
      return;
    }
    await createProject({
      name: newProjectName.trim(),
      color: '#3b82f6',
    });
    setNewProjectName('');
    setIsAddingProject(false);
  };

  const navItems = [
    { id: 'list', label: 'All Tasks', icon: ListTodo, count: tasks.length },
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: tasks.filter((t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length,
    },
    { id: 'board', label: 'Board', icon: Kanban, count: null },
    { id: 'stats', label: 'Analytics', icon: BarChart2, count: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                TaskFlow
              </span>
              <span className="block text-[10px] text-zinc-400 font-mono tracking-wide">
                v1.2.0 • Pro
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded"
            title="Command Palette (⌘K)"
          >
            <Command className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main views */}
          <div className="space-y-0.5">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Views
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count > 0 && (
                    <span className="text-[11px] font-mono text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-200/50 dark:bg-zinc-700/50">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Workspaces / Projects */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              <span>Workspaces</span>
              <button
                onClick={() => setIsAddingProject(true)}
                className="hover:text-zinc-600 dark:hover:text-zinc-200"
                title="Add Workspace"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 'All' option */}
            <button
              onClick={() => setActiveProject('all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeProject === 'all'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-zinc-400" />
                <span>All Projects</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {tasks.length}
              </span>
            </button>

            {/* Project List */}
            {projects.map((proj) => {
              const count = tasks.filter((t) => t.project === proj.name).length;
              const isActive = activeProject === proj.name;

              return (
                <button
                  key={proj._id || proj.name}
                  onClick={() => {
                    setActiveProject(proj.name);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color || '#3b82f6' }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 ml-1">
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Inline add workspace */}
            {isAddingProject && (
              <form onSubmit={handleCreateProject} className="pt-2 px-1">
                <input
                  type="text"
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onBlur={() => {
                    if (!newProjectName.trim()) setIsAddingProject(false);
                  }}
                  placeholder="New workspace... ↵"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </form>
            )}
          </div>
        </div>

        {/* Footer info & theme switch */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
          {/* Theme switcher */}
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="text-[11px]">Theme</span>
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-xs shrink-0">
              SM
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                Suyash Mahajan
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                Personal Workspace
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

