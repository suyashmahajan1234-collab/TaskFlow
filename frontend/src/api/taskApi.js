const API_BASE = '/api';

export const taskApi = {
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE}/tasks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const json = await res.json();
    return json.data || [];
  },

  async getTaskById(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    const json = await res.json();
    return json.data;
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create task');
    }
    const json = await res.json();
    return json.data;
  },

  async updateTask(id, updates) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    const json = await res.json();
    return json.data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return true;
  },

  async addSubtask(taskId, title) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to add checklist item');
    const json = await res.json();
    return json.data;
  },

  async toggleSubtask(taskId, subtaskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle checklist item');
    const json = await res.json();
    return json.data;
  },

  async reorderTasks(updates) {
    const res = await fetch(`${API_BASE}/tasks/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error('Failed to reorder tasks');
    return true;
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/tasks/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    const json = await res.json();
    return json.data;
  },

  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data || [];
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to create project');
    const json = await res.json();
    return json.data;
  },
};

