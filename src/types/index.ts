export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'rep';
  phone: string;
  department: string;
  account: number;
}

export interface Account {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  created_at: string;
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
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  source: string;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string;
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
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  account: number;
  name: string;
  contact: number;
  assigned_to: number | null;
  amount: string;
  stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date: string | null;
  probability: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  contact_name?: string;
  assigned_to_name?: string;
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