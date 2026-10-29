import React, { useState, useEffect } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import TaskList from './components/tasks/TaskList';
import TaskBoard from './components/tasks/TaskBoard';
import TodayView from './components/tasks/TodayView';
import StatsSummary from './components/stats/StatsSummary';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import NewTaskModal from './components/tasks/NewTaskModal';
import CommandPalette from './components/common/CommandPalette';
import ToastContainer from './components/common/Toast';

function DashboardContent() {
  const { activeView, loading, setIsNewTaskOpen } = useTasks();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global 'n' shortcut to create task when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsNewTaskOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsNewTaskOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {loading ? (
            <div className="max-w-3xl mx-auto space-y-4 pt-4 animate-pulse">
              <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
              <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
              <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
              <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {activeView === 'list' && <TaskList />}
              {activeView === 'board' && <TaskBoard />}
              {activeView === 'today' && <TodayView />}
              {activeView === 'stats' && <StatsSummary />}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <TaskDetailModal />
      <NewTaskModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}

