const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    description: {
      type: String,
      default: '',
    },
    taskCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', ProjectSchema);

