const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/Task');
const Project = require('../models/Project');
const connectDB = require('../config/db');

dotenv.config({ path: __dirname + '/../../.env' });

const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(18, 0, 0, 0);
  return date;
};

const initialProjects = [
  { name: 'Engineering', color: '#3b82f6', description: 'Core product architecture, API services & stability' },
  { name: 'Design System', color: '#8b5cf6', description: 'Component library, design tokens, micro-interactions' },
  { name: 'Product Roadmap', color: '#10b981', description: 'Customer requests, telemetry, feature planning' },
  { name: 'Personal', color: '#f59e0b', description: 'Reading notes, learning topics, deep work blocks' },
];

const sampleTasks = [
  {
    title: 'Audit API rate limiting and add token bucket protection',
    description: 'Ensure public endpoints have sensible rate limiting to prevent scrape surges. Focus on auth and search routes.',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: getRelativeDate(0), // Today
    project: 'Engineering',
    tags: ['security', 'backend', 'api'],
    subtasks: [
      { title: 'Audit current request burst metrics in Datadog', completed: true },
      { title: 'Implement sliding window counter middleware', completed: true },
      { title: 'Verify custom 429 response headers and Retry-After', completed: false },
      { title: 'Run load testing simulation with k6', completed: false },
    ],
    activityLog: [
      { action: 'Moved status to in progress', timestamp: new Date(Date.now() - 3600000 * 2) },
      { action: 'Completed checklist item: "Audit current request burst metrics"', timestamp: new Date(Date.now() - 3600000 * 4) },
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000) },
    ],
    order: 0,
  },
  {
    title: 'Refine dark mode contrast for muted typography',
    description: 'Current secondary text in dark mode dips below 4.5:1 ratio on OLED screens. Adjust zinc token shades to satisfy WCAG AA.',
    status: 'todo',
    priority: 'high',
    dueDate: getRelativeDate(1), // Tomorrow
    project: 'Design System',
    tags: ['accessibility', 'ui', 'css'],
    subtasks: [
      { title: 'Test zinc-400 vs zinc-300 on dark background cards', completed: true },
      { title: 'Verify border contrast on inactive tabs', completed: false },
      { title: 'Audit disabled input state readability', completed: false },
    ],
    activityLog: [
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 2) },
    ],
    order: 1,
  },
  {
    title: 'Migrate session storage to HTTP-only SameSite=Strict cookies',
    description: 'Phase out localStorage JWT persistence to eliminate XSS surface area. Coordinate with auth service team.',
    status: 'todo',
    priority: 'high',
    dueDate: getRelativeDate(2),
    project: 'Engineering',
    tags: ['auth', 'security'],
    subtasks: [
      { title: 'Update server response with secure Set-Cookie headers', completed: false },
      { title: 'Add cross-origin credentials to Axios client instance', completed: false },
      { title: 'Test Safari ITP handling for partitioned cookies', completed: false },
    ],
    activityLog: [
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 3) },
    ],
    order: 2,
  },
  {
    title: 'Implement command palette (⌘K) quick filters',
    description: 'Users should be able to jump to "My Tasks", filter by priority, or search projects directly from the keyboard without touching the mouse.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: getRelativeDate(3),
    project: 'Design System',
    tags: ['ux', 'shortcuts', 'frontend'],
    subtasks: [
      { title: 'Bind global ⌘K / Ctrl+K keyboard listener', completed: true },
      { title: 'Fuzzy search matching over active task list', completed: true },
      { title: 'Action items for quick status transitions', completed: false },
    ],
    activityLog: [
      { action: 'Moved status to in progress', timestamp: new Date(Date.now() - 7200000) },
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 2) },
    ],
    order: 3,
  },
  {
    title: 'Draft release notes for v2.4 search filter rollout',
    description: 'Highlight real-time search, multi-tag filtering, and overdue task alerts for customer release digest.',
    status: 'in_review',
    priority: 'medium',
    dueDate: getRelativeDate(4),
    project: 'Product Roadmap',
    tags: ['release', 'docs'],
    subtasks: [
      { title: 'Collect changelog diffs from engineering commits', completed: true },
      { title: 'Capture 3 high-res demo GIFs of board view', completed: true },
      { title: 'Send draft to marketing for copy pass', completed: false },
    ],
    activityLog: [
      { action: 'Moved status to in review', timestamp: new Date(Date.now() - 14400000) },
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 4) },
    ],
    order: 4,
  },
  {
    title: 'Replace full page modal with responsive slide-over drawer',
    description: 'On mobile and tablet viewports, the centered modal covers too much screen space. A slide-over sheet feels much more native.',
    status: 'completed',
    priority: 'medium',
    dueDate: getRelativeDate(-1), // Yesterday
    project: 'Design System',
    tags: ['mobile', 'components'],
    subtasks: [
      { title: 'Implement backdrop blur and swipe-to-dismiss gesture', completed: true },
      { title: 'Preserve focus trap and keyboard ESC handler', completed: true },
      { title: 'Verify responsive breakpoint behavior on iOS Safari', completed: true },
    ],
    activityLog: [
      { action: 'Moved status to completed', timestamp: new Date(Date.now() - 3600000 * 8) },
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 5) },
    ],
    order: 5,
  },
  {
    title: 'Benchmark PostgreSQL connection pool vs Mongo connection reuse',
    description: 'Prepare metrics for team engineering sync comparing cold start latency in serverless environments.',
    status: 'backlog',
    priority: 'low',
    dueDate: null,
    project: 'Engineering',
    tags: ['performance', 'database', 'research'],
    subtasks: [
      { title: 'Set up benchmark suite using autocannon', completed: false },
      { title: 'Document memory footprint under 500 concurrent users', completed: false },
    ],
    activityLog: [
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 6) },
    ],
    order: 6,
  },
  {
    title: 'Prep slides for Monday product sync & customer telemetry',
    description: 'Synthesize the top 5 requested filters from user surveys and correlate with weekly active task completion metrics.',
    status: 'todo',
    priority: 'high',
    dueDate: getRelativeDate(0), // Today
    project: 'Product Roadmap',
    tags: ['analytics', 'presentation'],
    subtasks: [
      { title: 'Pull weekly active user cohort stats', completed: true },
      { title: 'Create summary slide for bottleneck drop-offs', completed: false },
    ],
    activityLog: [
      { action: 'Created task', timestamp: new Date(Date.now() - 43200000) },
    ],
    order: 7,
  },
  {
    title: 'Read paper on optimistic concurrency in collaborative state machines',
    description: 'Personal study block: CRDTs and local-first architectures for desktop task management clients.',
    status: 'backlog',
    priority: 'low',
    dueDate: null,
    project: 'Personal',
    tags: ['reading', 'architecture'],
    subtasks: [],
    activityLog: [
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 7) },
    ],
    order: 8,
  },
  {
    title: 'Fix edge case with recurring tasks spanning daylight saving time',
    description: 'Investigate UTC offset calculation issue reported by European workspace users during timezone change.',
    status: 'completed',
    priority: 'urgent',
    dueDate: getRelativeDate(-2),
    project: 'Engineering',
    tags: ['bug', 'datetime'],
    subtasks: [
      { title: 'Reproduce with mock UTC+1 to UTC+2 transition tests', completed: true },
      { title: 'Switch date math to date-fns timezone-aware calculations', completed: true },
      { title: 'Deploy patch to staging and verify calendar feed', completed: true },
    ],
    activityLog: [
      { action: 'Moved status to completed', timestamp: new Date(Date.now() - 86400000) },
      { action: 'Created task', timestamp: new Date(Date.now() - 86400000 * 3) },
    ],
    order: 9,
  },
];

const seedDatabase = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('MongoDB not reachable. Seed data will be used by in-memory fallback store.');
      return sampleTasks;
    }

    await Task.deleteMany({});
    await Project.deleteMany({});

    await Project.insertMany(initialProjects);
    await Task.insertMany(sampleTasks);

    console.log(`✓ Seeded ${initialProjects.length} projects and ${sampleTasks.length} tasks successfully!`);
    return sampleTasks;
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = { sampleTasks, initialProjects, seedDatabase };

