import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://moldcrm-backend-moldcrm-backend.up.railway.app/api';

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
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/profile/'),
  register: (data: any) => api.post('/auth/register/', data),
};

export const leadsAPI = {
  getAll: () => api.get<Lead[]>('/leads/'),
  getById: (id: number) => api.get<Lead>(`/leads/${id}/`),
  create: (data: Partial<Lead>) => api.post<Lead>('/leads/', data),
  update: (id: number, data: Partial<Lead>) => api.patch<Lead>(`/leads/${id}/`, data),
  delete: (id: number) => api.delete(`/leads/${id}/`),
};

export const contactsAPI = {
  getAll: () => api.get<Contact[]>('/contacts/'),
  getById: (id: number) => api.get<Contact>(`/contacts/${id}/`),
  create: (data: Partial<Contact>) => api.post<Contact>('/contacts/', data),
  update: (id: number, data: Partial<Contact>) => api.patch<Contact>(`/contacts/${id}/`, data),
  delete: (id: number) => api.delete(`/contacts/${id}/`),
};

export const dealsAPI = {
  getAll: () => api.get<Deal[]>('/deals/'),
  getById: (id: number) => api.get<Deal>(`/deals/${id}/`),
  create: (data: Partial<Deal>) => api.post<Deal>('/deals/', data),
  update: (id: number, data: Partial<Deal>) => api.patch<Deal>(`/deals/${id}/`, data),
  delete: (id: number) => api.delete(`/deals/${id}/`),
};

export const dashboardAPI = {
  getData: () => api.get<DashboardData>('/dashboard/'),
};