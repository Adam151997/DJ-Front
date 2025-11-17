// ==================== USER & AUTH TYPES ====================

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  is_active: boolean;
  date_joined: string;
  profile_picture?: string;
  phone?: string;
  team?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== LEAD TYPES ====================

export interface Lead {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
  source?: string;
  description?: string;
  assigned_to?: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface LeadFormData {
  title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  status?: string;
  source?: string;
  description?: string;
  assigned_to?: number[];
  tags?: string[];
}

// ==================== CONTACT TYPES ====================

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  account?: Account;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  description?: string;
  assigned_to?: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  account?: number;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  description?: string;
  assigned_to?: number[];
  tags?: string[];
}

// ==================== ACCOUNT TYPES ====================

export interface Account {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  description?: string;
  assigned_to?: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
  contacts?: Contact[];
}

export interface AccountFormData {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  description?: string;
  assigned_to?: number[];
  tags?: string[];
}

// ==================== OPPORTUNITY TYPES ====================

export interface Opportunity {
  id: number;
  name: string;
  account?: Account;
  amount?: number;
  currency?: string;
  stage: string;
  probability?: number;
  expected_close_date?: string;
  closed_on?: string;
  description?: string;
  lead_source?: string;
  assigned_to?: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface OpportunityFormData {
  name: string;
  account?: number;
  amount?: number;
  currency?: string;
  stage: string;
  probability?: number;
  expected_close_date?: string;
  description?: string;
  lead_source?: string;
  assigned_to?: number[];
  tags?: string[];
}

// ==================== TASK TYPES ====================

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: User;
  created_by?: User;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  related_to_type?: string;
  related_to_id?: number;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: number;
  related_to_type?: string;
  related_to_id?: number;
}

// ==================== CASE TYPES ====================

export interface Case {
  id: number;
  name: string;
  status: 'new' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type?: string;
  account?: Account;
  contact?: Contact;
  description?: string;
  resolution?: string;
  assigned_to?: User;
  created_by?: User;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface CaseFormData {
  name: string;
  status?: string;
  priority?: string;
  type?: string;
  account?: number;
  contact?: number;
  description?: string;
  resolution?: string;
  assigned_to?: number;
}

// ==================== INVOICE TYPES ====================

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  account?: Account;
  contact?: Contact;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax?: number;
  total: number;
  currency?: string;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  paid_at?: string;
}

export interface InvoiceFormData {
  invoice_number?: string;
  account?: number;
  contact?: number;
  invoice_date: string;
  due_date: string;
  status?: string;
  subtotal: number;
  tax?: number;
  total: number;
  currency?: string;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
}

// ==================== EVENT TYPES ====================

export interface Event {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location?: string;
  event_type?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees?: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  related_to_type?: string;
  related_to_id?: number;
}

export interface EventFormData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day?: boolean;
  location?: string;
  event_type?: string;
  status?: string;
  attendees?: number[];
  related_to_type?: string;
  related_to_id?: number;
}

// ==================== TEAM TYPES ====================

export interface Team {
  id: number;
  name: string;
  description?: string;
  members: User[];
  created_by?: User;
  created_at: string;
  updated_at: string;
}

export interface TeamFormData {
  name: string;
  description?: string;
  members?: number[];
}

// ==================== NOTE TYPES ====================

export interface Note {
  id: number;
  content: string;
  created_by?: User;
  created_at: string;
  updated_at: string;
  related_to_type?: string;
  related_to_id?: number;
}

export interface NoteFormData {
  content: string;
  related_to_type?: string;
  related_to_id?: number;
}

// ==================== ATTACHMENT TYPES ====================

export interface Attachment {
  id: number;
  file: string;
  file_name: string;
  file_size: number;
  file_type?: string;
  uploaded_by?: User;
  uploaded_at: string;
  related_to_type?: string;
  related_to_id?: number;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  total_leads: number;
  total_contacts: number;
  total_accounts: number;
  total_opportunities: number;
  total_tasks: number;
  total_cases: number;
  total_invoices: number;
  total_events: number;
  leads_by_status?: Record<string, number>;
  opportunities_by_stage?: Record<string, number>;
  tasks_by_status?: Record<string, number>;
  cases_by_status?: Record<string, number>;
  invoices_by_status?: Record<string, number>;
  revenue_summary?: {
    total_revenue: number;
    pending_revenue: number;
    overdue_revenue: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recent_leads?: Lead[];
  recent_opportunities?: Opportunity[];
  upcoming_tasks?: Task[];
  upcoming_events?: Event[];
}

// ==================== AI AGENT TYPES ====================

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIQueryRequest {
  query: string;
  conversation_history?: AIMessage[];
}

export interface AIQueryResponse {
  success: boolean;
  response: string;
  function_calls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;
  conversation_history?: AIMessage[];
}

export interface AISuggestion {
  text: string;
  category?: string;
}

// ==================== AI INSIGHTS TYPES ====================

export interface AIInsight {
  id: number;
  insight_type: 'agent_query' | 'agent_response' | 'lead_score' | 'deal_prediction' | 'next_action' | 'risk_alert';
  content: string;
  confidence?: number;
  metadata?: Record<string, any>;
  is_read: boolean;
  lead?: Lead;
  contact?: Contact;
  opportunity?: Opportunity;
  created_at: string;
  updated_at: string;
}

// ==================== API RESPONSE TYPES ====================

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// ==================== FILTER & SORT TYPES ====================

export interface FilterParams {
  search?: string;
  status?: string;
  assigned_to?: number;
  created_by?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}
