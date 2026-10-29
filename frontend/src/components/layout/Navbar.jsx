import React, { useState } from 'react';
import {
  Search,
  Plus,
  Menu,
  Filter,
  ListTodo,
  Kanban,
  Calendar,
  BarChart2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function Navbar({ onOpenMobileSidebar }) {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setIsCommandPaletteOpen,
    setIsNewTaskOpen,
    activePriority,
    setActivePriority,
    activeStatus,
    setActiveStatus,
    activeProject,
  } = useTasks();

  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = activePriority !== 'all' || activeStatus !== 'all';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        {/* Left: Mobile Menu + View Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 lg:hidden rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop View Switcher Pills */}
          <div className="hidden sm:flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-subtle'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'board'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-subtle'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setActiveView('today')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'today'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-subtle'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={() => setActiveView('stats')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'stats'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-subtle'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Stats</span>
            </button>
          </div>
        </div>

        {/* Center / Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center justify-between px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-400 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search tasks, commands...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-600 shadow-subtle">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Filter + New Task button */}
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              hasActiveFilters || showFilters
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* New Task Button */}
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 shadow-subtle transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Row Expandable */}
      {showFilters && (
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] font-medium uppercase">Priority:</span>
            <select
              value={activePriority}
              onChange={(e) => setActivePriority(e.target.value)}
              className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] font-medium uppercase">Status:</span>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="backlog">Backlog</option>
              <option value="completed">Done</option>
            </select>
          </div>

          {/* Inline search for mobile */}
          <div className="flex-1 min-w-[180px] md:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks by name..."
              className="w-full px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setActivePriority('all');
                setActiveStatus('all');
                setSearchQuery('');
              }}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 text-[11px]"
            >
              <X className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

