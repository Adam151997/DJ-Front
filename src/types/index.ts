export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'rep';
  phone: string;
  department: string;
  account: number;
  account_name?: string;
}

export interface Account {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  created_at: string;
}

export interface Activity {
  id: number;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'other';
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  lead: number | null;
  contact: number | null;
  deal: number | null;
  created_by: number;
  created_by_name: string;
  related_object: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  content: string;
  lead: number | null;
  contact: number | null;
  deal: number | null;
  created_by: number;
  created_by_name: string;
  related_object: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  account: number;
  assigned_to: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  source: string;
  notes_text: string;  // CHANGED FROM 'notes' TO 'notes_text'
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
  assigned_to_name?: string;
  activities?: Activity[];
  notes_list?: Note[];
}

export interface Contact {
  id: number;
  account: number;
  lead: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
  lead_source?: string;
  deal_count?: number;
  activities?: Activity[];
  notes_list?: Note[];
}

export interface Deal {
  id: number;
  account: number;
  name: string;
  contact: number;
  assigned_to: number | null;
  amount: string | null;
  stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date: string | null;
  probability: number;
  notes_text: string;  // CHANGED FROM 'notes' TO 'notes_text'
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
  contact_name?: string;
  assigned_to_name?: string;
  activities?: Activity[];
  notes_list?: Note[];
}

export interface DashboardData {
  lead_analytics: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
  };
  deal_analytics: {
    total_amount: string | null;
    won_amount: string | null;
    open_deals: number;
  };
  recent_leads: Lead[];
  recent_deals: Deal[];
}

export interface PipelineAnalytics {
  stage_counts: Array<{
    stage: string;
    count: number;
    total_amount: string | null;
  }>;
  win_rate: number;
  pipeline_value: number;
  total_deals: number;
  won_deals: number;
  lost_deals: number;
}