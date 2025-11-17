import axios from 'axios';

// Use environment variable or fallback to DJCRM backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login/', data).then(res => res.data),
  logout: () => api.post('/auth/logout/').then(res => res.data),
  register: (data: any) => api.post('/auth/register/', data).then(res => res.data),
  getProfile: () => api.get('/users/profile/').then(res => res.data),
};

// ==================== LEADS API ====================
export const leadsAPI = {
  getAll: (params?: any) => api.get('/leads/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/leads/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/leads/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/leads/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/leads/${id}/`).then(res => res.data),
};

// ==================== CONTACTS API ====================
export const contactsAPI = {
  getAll: (params?: any) => api.get('/contacts/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/contacts/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/contacts/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/contacts/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/contacts/${id}/`).then(res => res.data),
};

// ==================== ACCOUNTS API ====================
export const accountsAPI = {
  getAll: (params?: any) => api.get('/accounts/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/accounts/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/accounts/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/accounts/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/accounts/${id}/`).then(res => res.data),
};

// ==================== OPPORTUNITIES API ====================
export const opportunitiesAPI = {
  getAll: (params?: any) => api.get('/opportunities/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/opportunities/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/opportunities/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/opportunities/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/opportunities/${id}/`).then(res => res.data),
};

// ==================== TASKS API ====================
export const tasksAPI = {
  getAll: (params?: any) => api.get('/tasks/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/tasks/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/tasks/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/tasks/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/tasks/${id}/`).then(res => res.data),
  complete: (id: number) => api.post(`/tasks/${id}/complete/`).then(res => res.data),
};

// ==================== CASES API ====================
export const casesAPI = {
  getAll: (params?: any) => api.get('/cases/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/cases/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/cases/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/cases/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/cases/${id}/`).then(res => res.data),
  close: (id: number, resolution?: string) =>
    api.post(`/cases/${id}/close/`, { resolution }).then(res => res.data),
};

// ==================== INVOICES API ====================
export const invoicesAPI = {
  getAll: (params?: any) => api.get('/invoices/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/invoices/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/invoices/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/invoices/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/invoices/${id}/`).then(res => res.data),
  markPaid: (id: number) => api.post(`/invoices/${id}/mark_paid/`).then(res => res.data),
  markSent: (id: number) => api.post(`/invoices/${id}/mark_sent/`).then(res => res.data),
};

// ==================== EVENTS API ====================
export const eventsAPI = {
  getAll: (params?: any) => api.get('/events/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/events/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/events/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/events/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/events/${id}/`).then(res => res.data),
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: (params?: any) => api.get('/users/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/users/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/users/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/users/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/users/${id}/`).then(res => res.data),
  updateProfile: (data: any) => api.patch('/users/profile/', data).then(res => res.data),
};

// ==================== TEAMS API ====================
export const teamsAPI = {
  getAll: (params?: any) => api.get('/teams/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/teams/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/teams/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/teams/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/teams/${id}/`).then(res => res.data),
  addMember: (teamId: number, userId: number) =>
    api.post(`/teams/${teamId}/add_member/`, { user_id: userId }).then(res => res.data),
  removeMember: (teamId: number, userId: number) =>
    api.post(`/teams/${teamId}/remove_member/`, { user_id: userId }).then(res => res.data),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getData: () => api.get('/dashboard/').then(res => res.data),
  getStats: () => api.get('/dashboard/stats/').then(res => res.data),
};

// ==================== COMMON/NOTES API ====================
export const notesAPI = {
  getAll: (params?: any) => api.get('/notes/', { params }).then(res => res.data),
  create: (data: any) => api.post('/notes/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/notes/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/notes/${id}/`).then(res => res.data),
};

// ==================== COMMON/ATTACHMENTS API ====================
export const attachmentsAPI = {
  getAll: (params?: any) => api.get('/attachments/', { params }).then(res => res.data),
  upload: (formData: FormData) =>
    api.post('/attachments/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  delete: (id: number) => api.delete(`/attachments/${id}/`).then(res => res.data),
};

// ==================== AI AGENT API ====================
export const aiAgentAPI = {
  query: (data: { query: string; conversation_history?: any[] }) =>
    api.post('/v1/ai-agent/query/', data, { timeout: 30000 }).then(res => res.data),
  getSuggestions: () =>
    api.post('/v1/ai-agent/suggestions/').then(res => res.data),
};

// ==================== AI INSIGHTS API ====================
export const aiInsightsAPI = {
  getAll: (params?: any) => api.get('/v1/ai-insights/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/v1/ai-insights/${id}/`).then(res => res.data),
  markAsRead: (id: number) => api.post(`/v1/ai-insights/${id}/mark_read/`).then(res => res.data),
};
