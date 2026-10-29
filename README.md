# TaskFlow — Modern MERN Stack Task Manager

A human-crafted, tactile productivity task manager built with the **MERN Stack** (MongoDB, Express, React, Node.js) and Tailwind CSS. Designed to feel intentional, distraction-free, and natural like modern tools such as Linear, Things 3, and Raycast.

---

## ✨ Features

- **Four Focused Work Views**:
  - **List View**: Grouped by workflow status (`In Progress`, `To Do`, `In Review`, `Backlog`, `Done`) with collapsible sections and instant inline task entry.
  - **Kanban Board**: Drag-and-drop / column shifting across 5 workflow columns with quick card creation.
  - **Focus / Today View**: A distraction-free day planner showing tasks scheduled for today, high/urgent priorities, and day completion percentage.
  - **Analytics & Telemetry**: Clean breakdown of completion rates, priority distribution, workspace counts, and recent activity timeline.
- **Natural Micro-Interactions**:
  - **Lightning Quick Add**: Type a task title inline and press `Enter` to create without breaking flow.
  - **Command Palette (`⌘K` / `Ctrl+K`)**: Instant search across all tasks, quick switching between views, workspace filtering, and keyboard navigation.
  - **Interactive Subtasks / Checklist**: Add subtasks, track completion progress bar (`2/4 items done`), and toggle items with a single click.
  - **Human Due Dates**: Smart relative formatting (`Today`, `Tomorrow`, `In 3d`, `2d overdue`).
  - **Priority System**: `Urgent`, `High`, `Medium`, and `Low` with subtle visual cues.
  - **Workspaces & Labels**: Organize tasks across workspaces (`Engineering`, `Design System`, `Product Roadmap`, `Personal`) with custom tags (`#security`, `#ui`, `#auth`).
  - **Activity Log**: Automatic tracking of status updates, checklist completions, and task changes.
  - **Balanced Theme Support**: Seamless Light Mode & Dark Mode with persistence.
  - **Resilient Fallback Mode**: Works with a local MongoDB instance, MongoDB Atlas, or an in-memory development store with sample tasks if MongoDB is offline.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS + Lucide Icons
  - Context API for state management with optimistic UI updates
- **Backend**:
  - Node.js + Express.js
  - MongoDB + Mongoose ODM
  - RESTful API with search, status/priority filtering, subtask nested routes, and dashboard metrics
  - Auto-seeding of realistic sample data

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (running locally on port 27017 or a MongoDB Atlas URI)

### 2. Quick Start
From the project root:

```bash
# Start both backend and frontend concurrently
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **API Health**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Command Palette & Search |
| `N` | Open New Task Dialog |
| `Enter` | Save task in inline quick-add |
| `Esc` | Close modal or palette |

---

## 📂 Project Structure

```
Task Manager/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # Database connection & graceful reconnect
│   │   ├── models/Task.js         # Mongoose schema with subtasks & activity log
│   │   ├── models/Project.js      # Workspace schema
│   │   ├── controllers/           # API controllers (tasks, projects, stats)
│   │   ├── routes/                # Express REST routes
│   │   ├── middleware/            # Error handling middleware
│   │   ├── utils/seedData.js      # Thoughtful, realistic sample seed tasks
│   │   └── server.js              # Express app bootstrap
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/taskApi.js         # Clean fetch client
│   │   ├── context/TaskContext.jsx# Application state & optimistic mutations
│   │   ├── components/
│   │   │   ├── layout/            # Sidebar & Navbar
│   │   │   ├── tasks/             # List, Board, Today, Modals, Badges
│   │   │   ├── stats/             # Analytics dashboard
│   │   │   └── common/            # CommandPalette & Toast
│   │   ├── utils/dateUtils.js     # Human relative date calculation
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js             # Vite config with API proxy
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                   # Root dev orchestrator
└── README.md
```

