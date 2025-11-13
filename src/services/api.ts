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
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { username: string; password: string }) => 
    api.post('/auth/login/', data).then(res => res.data),
  logout: () => api.post('/auth/logout/').then(res => res.data),
  getProfile: () => api.get('/users/profile/').then(res => res.data),
};

export const leadsAPI = {
  getAll: () => api.get('/leads/').then(res => res.data),
  getById: (id: number) => api.get(`/leads/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/leads/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/leads/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/leads/${id}/`).then(res => res.data),
};

export const contactsAPI = {
  getAll: () => api.get('/contacts/').then(res => res.data),
  getById: (id: number) => api.get(`/contacts/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/contacts/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/contacts/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/contacts/${id}/`).then(res => res.data),
  convertFromLead: (leadId: number) => 
    api.post('/contacts/convert_from_lead/', { lead_id: leadId }).then(res => res.data),
};

export const dealsAPI = {
  getAll: () => api.get('/deals/').then(res => res.data),
  getById: (id: number) => api.get(`/deals/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/deals/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/deals/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/deals/${id}/`).then(res => res.data),
  updateStage: (dealId: number, stage: string) => 
    api.patch(`/deals/${dealId}/update_stage/`, { stage }).then(res => res.data),
  getPipelineAnalytics: () => 
    api.get('/deals/pipeline_analytics/').then(res => res.data),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard/').then(res => res.data),
};

export const customObjectsAPI = {
  getAll: () => api.get('/custom-objects/').then(res => res.data),
  getById: (id: number) => api.get(`/custom-objects/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/custom-objects/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/custom-objects/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/custom-objects/${id}/`).then(res => res.data),
};

export const customFieldsAPI = {
  getAll: (objectId?: number) => {
    const url = objectId ? `/custom-fields/?custom_object=${objectId}` : '/custom-fields/';
    return api.get(url).then(res => res.data);
  },
  getById: (id: number) => api.get(`/custom-fields/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/custom-fields/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/custom-fields/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/custom-fields/${id}/`).then(res => res.data),
};

export const pipelineStagesAPI = {
  getAll: () => api.get('/pipeline-stages/').then(res => res.data),
  getById: (id: number) => api.get(`/pipeline-stages/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/pipeline-stages/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/pipeline-stages/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/pipeline-stages/${id}/`).then(res => res.data),
  reorder: (stages: Array<{ id: number; order: number }>) =>
    api.post('/pipeline-stages/reorder/', { stages }).then(res => res.data),
};