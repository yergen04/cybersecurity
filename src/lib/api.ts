const API_URL = 'http://localhost:3001/api';

export interface Task {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  hint: string;
  files: string[];
  points: number;
  icon: string;
}

export interface Submission {
  id: string;
  username: string;
  task_id: number;
  submitted_flag: string;
  is_correct: boolean;
  submitted_at: string;
  tasks?: { title: string };
}

export const api = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async submitFlag(taskId: number, flag: string, username: string = 'anonymous'): Promise<{ success: boolean; correct: boolean }> {
    const response = await fetch(`${API_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, flag, username })
    });
    if (!response.ok) throw new Error('Failed to submit flag');
    return response.json();
  },

  async login(login: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    return response.json();
  },

  async getSubmissions(token: string): Promise<Submission[]> {
    const response = await fetch(`${API_URL}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch submissions');
    return response.json();
  },

  async resetSubmissions(token: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/reset`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to reset submissions');
    return response.json();
  },

  getDownloadUrl(taskId: number): string {
    return `http://localhost:3001/api/download/${taskId}`;
  }
};
