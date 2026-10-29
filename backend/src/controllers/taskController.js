const mongoose = require('mongoose');
const Task = require('../models/Task');

// In-memory fallback store in case MongoDB is temporarily offline
let memoryTasks = [];
let memoryIdCounter = 1;

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to calculate overdue
const isOverdue = (date, status) => {
  if (!date || status === 'completed') return false;
  const taskDate = new Date(date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < now;
};

// Helper to check if date is today
const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// @desc    Get all tasks with filtering, search, and sorting
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, project, tag, dueDate, sortBy, sortOrder } = req.query;

    if (isDbConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      if (status && status !== 'all') {
        if (status.includes(',')) {
          query.status = { $in: status.split(',') };
        } else {
          query.status = status;
        }
      }

      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      if (project && project !== 'all') {
        query.project = project;
      }

      if (tag) {
        query.tags = tag;
      }

      // Due date filter
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const todayEnd = new Date(now.setHours(23, 59, 59, 999));

      if (dueDate === 'today') {
        query.dueDate = { $gte: todayStart, $lte: todayEnd };
      } else if (dueDate === 'overdue') {
        query.dueDate = { $lt: todayStart };
        query.status = { $ne: 'completed' };
      } else if (dueDate === 'upcoming') {
        query.dueDate = { $gt: todayEnd };
      } else if (dueDate === 'no-date') {
        query.dueDate = null;
      }

      // Sorting
      let sort = { order: 1, createdAt: -1 };
      if (sortBy) {
        const order = sortOrder === 'asc' ? 1 : -1;
        sort = { [sortBy]: order };
      }

      const tasks = await Task.find(query).sort(sort);
      return res.json({ success: true, count: tasks.length, data: tasks });
    }

    // In-memory fallback
    let results = [...memoryTasks];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      const statuses = status.split(',');
      results = results.filter((t) => statuses.includes(t.status));
    }

    if (priority && priority !== 'all') {
      results = results.filter((t) => t.priority === priority);
    }

    if (project && project !== 'all') {
      results = results.filter((t) => t.project === project);
    }

    if (tag) {
      results = results.filter((t) => t.tags.includes(tag));
    }

    if (dueDate === 'today') {
      results = results.filter((t) => isToday(t.dueDate));
    } else if (dueDate === 'overdue') {
      results = results.filter((t) => isOverdue(t.dueDate, t.status));
    } else if (dueDate === 'upcoming') {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      results = results.filter((t) => t.dueDate && new Date(t.dueDate) > today);
    } else if (dueDate === 'no-date') {
      results = results.filter((t) => !t.dueDate);
    }

    // Sorting
    results.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate) - new Date(b.dueDate)) * (sortOrder === 'asc' ? 1 : -1);
      }
      if (sortBy === 'priority') {
        const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return ((pOrder[b.priority] || 0) - (pOrder[a.priority] || 0)) * (sortOrder === 'asc' ? -1 : 1);
      }
      return (a.order - b.order) || (new Date(b.createdAt) - new Date(a.createdAt));
    });

    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.json({ success: true, data: task });
    }

    const task = memoryTasks.find((t) => t._id === id || t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, project, tags, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const initialLog = [{ action: 'Created task', timestamp: new Date() }];

    if (isDbConnected()) {
      const count = await Task.countDocuments({ status: status || 'todo' });
      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        project: project ? project.trim() : 'Core App',
        tags: Array.isArray(tags) ? tags : [],
        subtasks: Array.isArray(subtasks) ? subtasks : [],
        activityLog: initialLog,
        order: count,
      });

      return res.status(201).json({ success: true, data: task });
    }

    // In-memory fallback
    const newTask = {
      _id: `mem_${Date.now()}_${memoryIdCounter++}`,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      project: project ? project.trim() : 'Core App',
      tags: Array.isArray(tags) ? tags : [],
      subtasks: Array.isArray(subtasks)
        ? subtasks.map((st, i) => ({
            _id: `sub_${Date.now()}_${i}`,
            title: st.title || st,
            completed: !!st.completed,
          }))
        : [],
      activityLog: initialLog,
      order: memoryTasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (isDbConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Track human activity log
      if (updates.status && updates.status !== task.status) {
        const humanStatus = updates.status.replace('_', ' ');
        task.activityLog.unshift({
          action: `Moved status to ${humanStatus}`,
          timestamp: new Date(),
        });
      }
      if (updates.priority && updates.priority !== task.priority) {
        task.activityLog.unshift({
          action: `Changed priority to ${updates.priority}`,
          timestamp: new Date(),
        });
      }
      if (updates.dueDate && new Date(updates.dueDate).getTime() !== (task.dueDate ? new Date(task.dueDate).getTime() : 0)) {
        task.activityLog.unshift({
          action: `Updated due date to ${new Date(updates.dueDate).toLocaleDateString()}`,
          timestamp: new Date(),
        });
      }

      Object.assign(task, updates);
      await task.save();

      return res.json({ success: true, data: task });
    }

    // In-memory fallback
    const index = memoryTasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const currentTask = memoryTasks[index];
    const activityLog = [...(currentTask.activityLog || [])];

    if (updates.status && updates.status !== currentTask.status) {
      activityLog.unshift({
        action: `Moved status to ${updates.status.replace('_', ' ')}`,
        timestamp: new Date().toISOString(),
      });
    }

    const updatedTask = {
      ...currentTask,
      ...updates,
      activityLog,
      updatedAt: new Date().toISOString(),
    };

    memoryTasks[index] = updatedTask;
    return res.json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.json({ success: true, message: 'Task removed successfully' });
    }

    const index = memoryTasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    memoryTasks.splice(index, 1);
    return res.json({ success: true, message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a subtask to a task
// @route   POST /api/tasks/:id/subtasks
exports.addSubtask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Subtask title is required' });
    }

    if (isDbConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      task.subtasks.push({ title: title.trim(), completed: false });
      task.activityLog.unshift({
        action: `Added checklist item: "${title.trim()}"`,
        timestamp: new Date(),
      });
      await task.save();

      return res.json({ success: true, data: task });
    }

    const task = memoryTasks.find((t) => t._id === id || t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const newSubtask = {
      _id: `sub_${Date.now()}`,
      title: title.trim(),
      completed: false,
    };

    task.subtasks = task.subtasks || [];
    task.subtasks.push(newSubtask);
    task.activityLog = task.activityLog || [];
    task.activityLog.unshift({
      action: `Added checklist item: "${title.trim()}"`,
      timestamp: new Date().toISOString(),
    });

    return res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
exports.toggleSubtask = async (req, res, next) => {
  try {
    const { id, subtaskId } = req.params;

    if (isDbConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return res.status(404).json({ success: false, message: 'Subtask not found' });
      }

      subtask.completed = !subtask.completed;
      task.activityLog.unshift({
        action: `${subtask.completed ? 'Completed' : 'Reopened'} checklist item: "${subtask.title}"`,
        timestamp: new Date(),
      });
      await task.save();

      return res.json({ success: true, data: task });
    }

    const task = memoryTasks.find((t) => t._id === id || t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const subtask = task.subtasks?.find((s) => s._id === subtaskId || s.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    task.activityLog = task.activityLog || [];
    task.activityLog.unshift({
      action: `${subtask.completed ? 'Completed' : 'Reopened'} checklist item: "${subtask.title}"`,
      timestamp: new Date().toISOString(),
    });

    return res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder tasks (e.g. Kanban drop or custom order)
// @route   POST /api/tasks/reorder
exports.reorderTasks = async (req, res, next) => {
  try {
    const { updates } = req.body; // array of { id, status, order }

    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates must be an array' });
    }

    if (isDbConnected()) {
      const bulkOps = updates.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: {
            $set: {
              status: item.status,
              order: item.order,
            },
          },
        },
      }));

      await Task.bulkWrite(bulkOps);
      return res.json({ success: true, message: 'Tasks reordered' });
    }

    // In-memory
    updates.forEach((item) => {
      const task = memoryTasks.find((t) => t._id === item.id || t.id === item.id);
      if (task) {
        task.status = item.status;
        task.order = item.order;
      }
    });

    return res.json({ success: true, message: 'Tasks reordered' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/tasks/stats
exports.getStats = async (req, res, next) => {
  try {
    let allTasks = [];

    if (isDbConnected()) {
      allTasks = await Task.find({});
    } else {
      allTasks = memoryTasks;
    }

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'completed').length;
    const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
    const overdue = allTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byStatus = {
      backlog: allTasks.filter((t) => t.status === 'backlog').length,
      todo: allTasks.filter((t) => t.status === 'todo').length,
      in_progress: inProgress,
      in_review: allTasks.filter((t) => t.status === 'in_review').length,
      completed,
    };

    const byPriority = {
      urgent: allTasks.filter((t) => t.priority === 'urgent').length,
      high: allTasks.filter((t) => t.priority === 'high').length,
      medium: allTasks.filter((t) => t.priority === 'medium').length,
      low: allTasks.filter((t) => t.priority === 'low').length,
    };

    const projectCounts = {};
    allTasks.forEach((t) => {
      const p = t.project || 'General';
      projectCounts[p] = (projectCounts[p] || 0) + 1;
    });

    return res.json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        overdue,
        completionRate,
        byStatus,
        byPriority,
        byProject: Object.entries(projectCounts).map(([name, count]) => ({ name, count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export fallback memory store setter for seed data
exports.setMemoryTasks = (tasks) => {
  memoryTasks = tasks;
};

