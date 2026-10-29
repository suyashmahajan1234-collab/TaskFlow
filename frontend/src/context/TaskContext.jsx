import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View & Filter states
  const [activeView, setActiveView] = useState('list'); // 'list' | 'board' | 'today' | 'stats'
  const [activeProject, setActiveProject] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals & Panels
  const [selectedTask, setSelectedTask] = useState(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState('todo');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskflow_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData, statsData] = await Promise.all([
        taskApi.getTasks(),
        taskApi.getProjects(),
        taskApi.getStats(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const created = await taskApi.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task "${created.title.slice(0, 24)}..." created`, 'success');
      // refresh stats
      taskApi.getStats().then(setStats).catch(() => {});
      return created;
    } catch (err) {
      showToast(err.message || 'Could not create task', 'error');
      throw err;
    }
  };

  // Update Task (optimistic)
  const updateTask = async (id, updates) => {
    // Optimistic update
    const prevTasks = [...tasks];
    setTasks((current) =>
      current.map((t) => (t._id === id || t.id === id ? { ...t, ...updates } : t))
    );

    if (selectedTask && (selectedTask._id === id || selectedTask.id === id)) {
      setSelectedTask((prev) => ({ ...prev, ...updates }));
    }

    try {
      const updated = await taskApi.updateTask(id, updates);
      setTasks((current) =>
        current.map((t) => (t._id === id || t.id === id ? updated : t))
      );
      if (selectedTask && (selectedTask._id === id || selectedTask.id === id)) {
        setSelectedTask(updated);
      }
      taskApi.getStats().then(setStats).catch(() => {});
      return updated;
    } catch (err) {
      // Rollback on error
      setTasks(prevTasks);
      showToast(err.message || 'Could not update task', 'error');
      throw err;
    }
  };

  // Toggle complete
  const toggleTaskComplete = async (task) => {
    const isCompleted = task.status === 'completed';
    const newStatus = isCompleted ? 'todo' : 'completed';
    const taskId = task._id || task.id;

    await updateTask(taskId, { status: newStatus });
    showToast(
      isCompleted ? 'Task marked as active' : 'Task marked as completed',
      'info'
    );
  };

  // Delete Task
  const deleteTask = async (id) => {
    const prevTasks = [...tasks];
    setTasks((current) => current.filter((t) => t._id !== id && t.id !== id));
    if (selectedTask && (selectedTask._id === id || selectedTask.id === id)) {
      setSelectedTask(null);
    }

    try {
      await taskApi.deleteTask(id);
      showToast('Task removed', 'info');
      taskApi.getStats().then(setStats).catch(() => {});
    } catch (err) {
      setTasks(prevTasks);
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Subtasks
  const addSubtask = async (taskId, title) => {
    try {
      const updated = await taskApi.addSubtask(taskId, title);
      setTasks((current) =>
        current.map((t) => (t._id === taskId || t.id === taskId ? updated : t))
      );
      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setSelectedTask(updated);
      }
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to add checklist item', 'error');
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const updated = await taskApi.toggleSubtask(taskId, subtaskId);
      setTasks((current) =>
        current.map((t) => (t._id === taskId || t.id === taskId ? updated : t))
      );
      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setSelectedTask(updated);
      }
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to toggle checklist item', 'error');
    }
  };

  // Reorder tasks for Kanban / List
  const reorderTasks = async (updates) => {
    // updates: [{ id, status, order }]
    setTasks((current) => {
      const map = new Map(updates.map((u) => [u.id, u]));
      return current.map((t) => {
        const up = map.get(t._id) || map.get(t.id);
        if (up) {
          return { ...t, status: up.status, order: up.order };
        }
        return t;
      });
    });

    try {
      await taskApi.reorderTasks(updates);
      taskApi.getStats().then(setStats).catch(() => {});
    } catch (err) {
      console.error('Failed to sync reorder:', err);
    }
  };

  // Create Project
  const createProject = async (data) => {
    try {
      const created = await taskApi.createProject(data);
      setProjects((prev) => [...prev, created]);
      showToast(`Workspace "${created.name}" created`, 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create workspace', 'error');
    }
  };

  // Filtered Tasks computation
  const filteredTasks = tasks.filter((task) => {
    // Project filter
    if (activeProject !== 'all' && task.project !== activeProject) {
      return false;
    }

    // Status filter
    if (activeStatus !== 'all' && task.status !== activeStatus) {
      return false;
    }

    // Priority filter
    if (activePriority !== 'all' && task.priority !== activePriority) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        projects,
        stats,
        loading,
        error,
        activeView,
        setActiveView,
        activeProject,
        setActiveProject,
        activeStatus,
        setActiveStatus,
        activePriority,
        setActivePriority,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        selectedTask,
        setSelectedTask,
        isNewTaskOpen,
        setIsNewTaskOpen,
        newTaskInitialStatus,
        setNewTaskInitialStatus,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        showToast,
        removeToast,
        isDarkMode,
        toggleDarkMode,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addSubtask,
        toggleSubtask,
        reorderTasks,
        createProject,
        refreshData: loadInitialData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

