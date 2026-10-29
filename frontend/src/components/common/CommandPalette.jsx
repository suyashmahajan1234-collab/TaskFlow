import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Kanban, ListTodo, Sun, Moon, Calendar, BarChart2, Tag, ArrowRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    setSelectedTask,
    setIsNewTaskOpen,
    setActiveView,
    projects,
    setActiveProject,
    isDarkMode,
    toggleDarkMode,
  } = useTasks();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build command suggestions
  const q = query.toLowerCase().trim();

  const viewCommands = [
    { id: 'view-list', title: 'Switch to List View', icon: ListTodo, action: () => { setActiveView('list'); setIsCommandPaletteOpen(false); } },
    { id: 'view-board', title: 'Switch to Kanban Board', icon: Kanban, action: () => { setActiveView('board'); setIsCommandPaletteOpen(false); } },
    { id: 'view-today', title: 'Switch to Focus / Today', icon: Calendar, action: () => { setActiveView('today'); setIsCommandPaletteOpen(false); } },
    { id: 'view-stats', title: 'View Productivity Analytics', icon: BarChart2, action: () => { setActiveView('stats'); setIsCommandPaletteOpen(false); } },
    { id: 'action-new', title: 'Create New Task', icon: Plus, action: () => { setIsCommandPaletteOpen(false); setIsNewTaskOpen(true); } },
    { id: 'action-theme', title: `Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`, icon: isDarkMode ? Sun : Moon, action: () => { toggleDarkMode(); setIsCommandPaletteOpen(false); } },
  ];

  const matchedProjects = projects.map((p) => ({
    id: `project-${p._id || p.name}`,
    title: `Filter Workspace: ${p.name}`,
    icon: Tag,
    action: () => { setActiveProject(p.name); setIsCommandPaletteOpen(false); },
  }));

  const matchedTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q)))
    .slice(0, 6)
    .map((t) => ({
      id: `task-${t._id || t.id}`,
      title: t.title,
      subtitle: `${t.project} • ${t.priority} • ${t.status.replace('_', ' ')}`,
      icon: ListTodo,
      action: () => { setSelectedTask(t); setIsCommandPaletteOpen(false); },
    }));

  const filteredCommands = [
    ...viewCommands.filter((c) => c.title.toLowerCase().includes(q)),
    ...matchedProjects.filter((p) => p.title.toLowerCase().includes(q)),
    ...matchedTasks,
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandPaletteOpen(false)} 
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-modal border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search tasks, or filter..."
            className="w-full px-3 py-3.5 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No matching commands or tasks found.
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                    <div className="truncate">
                      <span className="font-medium">{item.title}</span>
                      {item.subtitle && (
                        <span className="ml-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] text-zinc-400">
          <span>Navigation</span>
          <div className="flex items-center gap-2">
            <span>Use ↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}

