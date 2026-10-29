const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const Task = require('./models/Task');
const Project = require('./models/Project');
const { sampleTasks, initialProjects } = require('./utils/seedData');
const { setMemoryTasks } = require('./controllers/taskController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Server startup with DB init & auto-seed
const startServer = async () => {
  console.log('----------------------------------------------------');
  console.log(' Starting Task Flow Backend Server...');
  console.log('----------------------------------------------------');

  const connected = await connectDB();

  if (connected) {
    try {
      const taskCount = await Task.countDocuments();
      if (taskCount === 0) {
        console.log('⚡ Empty database detected. Auto-seeding initial realistic tasks...');
        await Project.insertMany(initialProjects);
        await Task.insertMany(sampleTasks);
        console.log('✓ Seeded demo tasks and projects.');
      }
    } catch (err) {
      console.warn('Seed check error:', err.message);
    }
  } else {
    // Initialize in-memory store so user can immediately experience the app
    console.log('⚡ Using responsive in-memory fallback store with realistic sample data.');
    setMemoryTasks(
      sampleTasks.map((t, idx) => ({
        ...t,
        _id: `sample_${idx + 1}`,
        createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    );
  }

  app.listen(PORT, () => {
    console.log(`✓ Server running at: http://localhost:${PORT}`);
    console.log(`✓ API Health: http://localhost:${PORT}/api/health`);
    console.log(`✓ Tasks endpoint: http://localhost:${PORT}/api/tasks`);
    console.log('----------------------------------------------------');
  });
};

startServer();

module.exports = app;

