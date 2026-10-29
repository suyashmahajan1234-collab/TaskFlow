const Project = require('../models/Project');
const mongoose = require('mongoose');

const defaultProjects = [
  { _id: 'proj_1', name: 'Engineering', color: '#3b82f6', description: 'Core product development & backend infra' },
  { _id: 'proj_2', name: 'Design System', color: '#8b5cf6', description: 'UI components, typography & themes' },
  { _id: 'proj_3', name: 'Product Roadmap', color: '#10b981', description: 'Q4 feature releases & customer requests' },
  { _id: 'proj_4', name: 'Personal', color: '#f59e0b', description: 'Personal reading, side quests, health' },
];

let memoryProjects = [...defaultProjects];

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getProjects = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let projects = await Project.find().sort({ createdAt: 1 });
      if (projects.length === 0) {
        // Seed default projects
        await Project.insertMany(defaultProjects.map(p => ({ name: p.name, color: p.color, description: p.description })));
        projects = await Project.find().sort({ createdAt: 1 });
      }
      return res.json({ success: true, data: projects });
    }
    return res.json({ success: true, data: memoryProjects });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name, color, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    if (isDbConnected()) {
      const project = await Project.create({
        name: name.trim(),
        color: color || '#3b82f6',
        description: description || '',
      });
      return res.status(201).json({ success: true, data: project });
    }

    const newProject = {
      _id: `proj_${Date.now()}`,
      name: name.trim(),
      color: color || '#3b82f6',
      description: description || '',
    };
    memoryProjects.push(newProject);
    return res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    next(error);
  }
};

