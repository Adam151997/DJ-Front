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
  updateStage: (dealId: number, pipelineStageId: number) =>
    api.patch(`/deals/${dealId}/update_stage/`, { pipeline_stage: pipelineStageId }).then(res => res.data),
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

// Business Templates API
export const templatesAPI = {
  getAll: () => api.get('/templates/').then(res => res.data),
  getById: (id: number) => api.get(`/templates/${id}/`).then(res => res.data),
  apply: (id: number, configuration?: any) =>
    api.post(`/templates/${id}/apply/`, { configuration }).then(res => res.data),
  getApplied: () => api.get('/applied-templates/').then(res => res.data),
};

// AI & Automation API
// AI Agent API (New conversational AI system)
export const aiAgentAPI = {
  query: (query: string, conversationHistory?: any[]) =>
    api.post('/ai-agent/query/',
      { query, conversation_history: conversationHistory },
      { timeout: 30000 } // 30 second timeout
    ).then(res => res.data),
  getSuggestions: (context?: any) =>
    api.post('/ai-agent/suggestions/', { context }).then(res => res.data),
};

// AI Insights API (DEPRECATED - Use aiAgentAPI instead)
export const aiInsightsAPI = {
  getAll: () => api.get('/ai-insights/').then(res => res.data),
  getById: (id: number) => api.get(`/ai-insights/${id}/`).then(res => res.data),
  markRead: (id: number) => api.patch(`/ai-insights/${id}/`, { is_read: true }).then(res => res.data),
  generateLeadScore: (leadId: number) =>
    api.post(`/ai-insights/generate-lead-score/`, { lead_id: leadId }).then(res => res.data),
  generateDealPrediction: (dealId: number) =>
    api.post(`/ai-insights/generate-deal-prediction/`, { deal_id: dealId }).then(res => res.data),
  analyzeSentiment: (text: string, entityType?: string, entityId?: number) =>
    api.post(`/ai-insights/analyze-sentiment/`, { text, entity_type: entityType, entity_id: entityId }).then(res => res.data),
};

export const workflowsAPI = {
  getAll: () => api.get('/workflows/').then(res => res.data),
  getById: (id: number) => api.get(`/workflows/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/workflows/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/workflows/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/workflows/${id}/`).then(res => res.data),
  activate: (id: number) => api.post(`/workflows/${id}/activate/`).then(res => res.data),
  pause: (id: number) => api.post(`/workflows/${id}/pause/`).then(res => res.data),
  getExecutions: (id: number) => api.get(`/workflows/${id}/executions/`).then(res => res.data),
};

// Enhanced CRM Features API
export const notesAPI = {
  getAll: (params?: { lead?: number; contact?: number; deal?: number }) =>
    api.get('/notes/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/notes/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/notes/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/notes/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/notes/${id}/`).then(res => res.data),
};

export const attachmentsAPI = {
  getAll: (params?: { note?: number; lead?: number; contact?: number; deal?: number }) =>
    api.get('/attachments/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/attachments/${id}/`).then(res => res.data),
  upload: (formData: FormData) =>
    api.post('/attachments/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  delete: (id: number) => api.delete(`/attachments/${id}/`).then(res => res.data),
};

export const tasksAPI = {
  getAll: (params?: { lead?: number; contact?: number; deal?: number; assigned_to?: number; status?: string }) =>
    api.get('/tasks/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/tasks/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/tasks/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/tasks/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/tasks/${id}/`).then(res => res.data),
};

export const activityLogsAPI = {
  getAll: (params?: { lead?: number; contact?: number; deal?: number; action_type?: string }) =>
    api.get('/activity-logs/', { params }).then(res => res.data),
  getById: (id: number) => api.get(`/activity-logs/${id}/`).then(res => res.data),
};

// Email API
export const emailTemplatesAPI = {
  getAll: () => api.get('/email-templates/').then(res => res.data),
  getById: (id: number) => api.get(`/email-templates/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/email-templates/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/email-templates/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/email-templates/${id}/`).then(res => res.data),
  preview: (id: number, data: any) => api.post(`/email-templates/${id}/preview/`, data).then(res => res.data),
};

export const emailCampaignsAPI = {
  getAll: () => api.get('/email-campaigns/').then(res => res.data),
  getById: (id: number) => api.get(`/email-campaigns/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/email-campaigns/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/email-campaigns/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/email-campaigns/${id}/`).then(res => res.data),
  send: (id: number) => api.post(`/email-campaigns/${id}/send/`).then(res => res.data),
  pause: (id: number) => api.post(`/email-campaigns/${id}/pause/`).then(res => res.data),
  getEmails: (id: number) => api.get(`/email-campaigns/${id}/emails/`).then(res => res.data),
  getStats: (id: number) => api.get(`/email-campaigns/${id}/stats/`).then(res => res.data),
};

export const emailsAPI = {
  getAll: () => api.get('/emails/').then(res => res.data),
  getById: (id: number) => api.get(`/emails/${id}/`).then(res => res.data),
  send: (data: any) => api.post('/emails/', data).then(res => res.data),
};

// Integrations API
export const integrationsAPI = {
  getAll: () => api.get('/integrations/').then(res => res.data),
  getById: (id: number) => api.get(`/integrations/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/integrations/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/integrations/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/integrations/${id}/`).then(res => res.data),
  sync: (id: number) => api.post(`/integrations/${id}/sync/`).then(res => res.data),
  test: (id: number) => api.post(`/integrations/${id}/test/`).then(res => res.data),
};

// Email Provider API
export const emailProvidersAPI = {
  getAll: () => api.get('/email-providers/').then(res => res.data),
  getById: (id: number) => api.get(`/email-providers/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/email-providers/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/email-providers/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/email-providers/${id}/`).then(res => res.data),
  verify: (id: number) => api.post(`/email-providers/${id}/verify/`).then(res => res.data),
  testSend: (id: number, data: { test_email: string }) =>
    api.post(`/email-providers/${id}/test-send/`, data).then(res => res.data),
  getStats: (id: number) => api.get(`/email-providers/${id}/stats/`).then(res => res.data),
  toggleActive: (id: number) => api.post(`/email-providers/${id}/toggle-active/`).then(res => res.data),
};

// Plugin API (Google Ads, Meta Ads, TikTok Ads, Shopify)
export const pluginsAPI = {
  getAll: () => api.get('/plugins/').then(res => res.data),
  getById: (id: number) => api.get(`/plugins/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/plugins/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/plugins/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/plugins/${id}/`).then(res => res.data),
  getOAuthUrl: (id: number, redirectUri: string) =>
    api.get(`/plugins/${id}/oauth-url/?redirect_uri=${encodeURIComponent(redirectUri)}`).then(res => res.data),
  handleOAuthCallback: (id: number, data: { code: string; state: string; redirect_uri: string }) =>
    api.post(`/plugins/${id}/oauth-callback/`, data).then(res => res.data),
  verify: (id: number) => api.post(`/plugins/${id}/verify/`).then(res => res.data),
  sync: (id: number, data?: { sync_type?: string }) =>
    api.post(`/plugins/${id}/sync/`, data || {}).then(res => res.data),
  getAccountInfo: (id: number) => api.get(`/plugins/${id}/account-info/`).then(res => res.data),
  refreshToken: (id: number) => api.post(`/plugins/${id}/refresh-token/`).then(res => res.data),
  toggleActive: (id: number) => api.post(`/plugins/${id}/toggle-active/`).then(res => res.data),
};

export const pluginEventsAPI = {
  getAll: (pluginId?: number) => {
    const url = pluginId ? `/plugin-events/?plugin=${pluginId}` : '/plugin-events/';
    return api.get(url).then(res => res.data);
  },
  getById: (id: number) => api.get(`/plugin-events/${id}/`).then(res => res.data),
};

export const pluginSyncLogsAPI = {
  getAll: (pluginId?: number) => {
    const url = pluginId ? `/plugin-sync-logs/?plugin=${pluginId}` : '/plugin-sync-logs/';
    return api.get(url).then(res => res.data);
  },
  getById: (id: number) => api.get(`/plugin-sync-logs/${id}/`).then(res => res.data),
};

// Enhanced Email Campaign APIs

// Segments API
export const segmentsAPI = {
  getAll: () => api.get('/segments/').then(res => res.data),
  getById: (id: number) => api.get(`/segments/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/segments/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/segments/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/segments/${id}/`).then(res => res.data),
  preview: (id: number, params?: { limit?: number }) =>
    api.get(`/segments/${id}/preview/`, { params }).then(res => res.data),
  calculateSize: (id: number) =>
    api.post(`/segments/${id}/calculate-size/`).then(res => res.data),
  performance: (id: number) =>
    api.get(`/segments/${id}/performance/`).then(res => res.data),
  validateConditions: (data: any) =>
    api.post('/segments/validate-conditions/', data).then(res => res.data),
};

// A/B Test API
export const abTestsAPI = {
  getAll: (campaignId?: number) => {
    const url = campaignId ? `/ab-tests/?campaign=${campaignId}` : '/ab-tests/';
    return api.get(url).then(res => res.data);
  },
  getById: (id: number) => api.get(`/ab-tests/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/ab-tests/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/ab-tests/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/ab-tests/${id}/`).then(res => res.data),
  results: (id: number) => api.get(`/ab-tests/${id}/results/`).then(res => res.data),
  selectWinner: (id: number, data: { winner: 'A' | 'B' }) =>
    api.post(`/ab-tests/${id}/select-winner/`, data).then(res => res.data),
};

// Drip Campaigns API
export const dripCampaignsAPI = {
  getAll: () => api.get('/drip-campaigns/').then(res => res.data),
  getById: (id: number) => api.get(`/drip-campaigns/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/drip-campaigns/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/drip-campaigns/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/drip-campaigns/${id}/`).then(res => res.data),
  activate: (id: number) => api.post(`/drip-campaigns/${id}/activate/`).then(res => res.data),
  pause: (id: number) => api.post(`/drip-campaigns/${id}/pause/`).then(res => res.data),
  enrollContact: (id: number, data: { contact_id?: number; lead_id?: number }) =>
    api.post(`/drip-campaigns/${id}/enroll-contact/`, data).then(res => res.data),
  analytics: (id: number) =>
    api.get(`/drip-campaigns/${id}/analytics/`).then(res => res.data),
  enrollments: (id: number, params?: { status?: string }) =>
    api.get(`/drip-campaigns/${id}/enrollments/`, { params }).then(res => res.data),
};

// Drip Campaign Steps API
export const dripStepsAPI = {
  getAll: (dripCampaignId: number) =>
    api.get(`/drip-campaign-steps/?drip_campaign=${dripCampaignId}`).then(res => res.data),
  getById: (id: number) => api.get(`/drip-campaign-steps/${id}/`).then(res => res.data),
  create: (data: any) => api.post('/drip-campaign-steps/', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/drip-campaign-steps/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/drip-campaign-steps/${id}/`).then(res => res.data),
  reorder: (id: number, data: { new_order: number }) =>
    api.post(`/drip-campaign-steps/${id}/reorder/`, data).then(res => res.data),
};

// Email Analytics API
export const emailAnalyticsAPI = {
  campaignOverview: (campaignId: number) =>
    api.get(`/email-analytics/campaign-overview/?campaign_id=${campaignId}`).then(res => res.data),
  compare: (campaignIds: number[]) =>
    api.get(`/email-analytics/compare/?campaign_ids=${campaignIds.join(',')}`).then(res => res.data),
  globalStats: (params?: { days?: number }) =>
    api.get('/email-analytics/global-stats/', { params }).then(res => res.data),
  contactEngagement: (params?: { contact_id?: number; lead_id?: number; email?: string }) =>
    api.get('/email-analytics/contact-engagement/', { params }).then(res => res.data),
  revenueAttribution: (params?: { start_date?: string; end_date?: string }) =>
    api.get('/email-analytics/revenue-attribution/', { params }).then(res => res.data),
  providerPerformance: (params?: { days?: number }) =>
    api.get('/email-analytics/provider-performance/', { params }).then(res => res.data),
};

// AI Features API
export const emailAIAPI = {
  optimizeSubject: (data: { subject: string; campaign_type?: string; target_audience?: string }) =>
    api.post('/email-ai/optimize-subject/', data).then(res => res.data),
  improveContent: (data: { content: string; style?: string; tone?: string }) =>
    api.post('/email-ai/improve-content/', data).then(res => res.data),
  personalize: (data: { content: string; contact_data: any; context?: any }) =>
    api.post('/email-ai/personalize/', data).then(res => res.data),
  predictSendTime: (data: { contact_id?: number; lead_id?: number; email?: string }) =>
    api.post('/email-ai/predict-send-time/', data).then(res => res.data),
  generateAbVariants: (data: { subject: string; element: string; num_variants?: number }) =>
    api.post('/email-ai/generate-ab-variants/', data).then(res => res.data),
  analyzePerformance: (campaignId: number) =>
    api.post('/email-ai/analyze-performance/', { campaign_id: campaignId }).then(res => res.data),
  suggestSegments: (data?: { min_size?: number; max_segments?: number }) =>
    api.post('/email-ai/suggest-segments/', data || {}).then(res => res.data),
  generateDripSequence: (data: { goal: string; audience: string; num_steps?: number }) =>
    api.post('/email-ai/generate-drip-sequence/', data).then(res => res.data),
  predictUnsubscribeRisk: (data: { contact_id?: number; lead_id?: number }) =>
    api.post('/email-ai/predict-unsubscribe-risk/', data).then(res => res.data),
  calculateSpamScore: (data: { subject: string; body_html: string; from_name?: string }) =>
    api.post('/email-ai/calculate-spam-score/', data).then(res => res.data),
};

// Template Tools API
export const templateToolsAPI = {
  validate: (data: { template_html: string; template_subject?: string }) =>
    api.post('/template-tools/validate/', data).then(res => res.data),
  preview: (data: { template_html: string; sample_data?: any }) =>
    api.post('/template-tools/preview/', data).then(res => res.data),
  extractVariables: (data: { template_html: string; template_subject?: string }) =>
    api.post('/template-tools/extract-variables/', data).then(res => res.data),
};