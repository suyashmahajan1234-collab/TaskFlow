const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'in_review', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    project: {
      type: String,
      trim: true,
      default: 'Core App',
    },
    tags: {
      type: [String],
      default: [],
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    activityLog: {
      type: [ActivityLogSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for completion percentage
TaskSchema.virtual('completionPercentage').get(function () {
  if (!this.subtasks || this.subtasks.length === 0) {
    return this.status === 'completed' ? 100 : 0;
  }
  const completed = this.subtasks.filter((s) => s.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Ensure virtuals are serialized
TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });

// Indexing for search and fast filtering
TaskSchema.index({ status: 1, priority: 1, project: 1 });
TaskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', TaskSchema);

