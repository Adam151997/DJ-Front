export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  department: string;
  account: number;  // Account ID
  account_name?: string;  // Account name for display
}

export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  notes: string;
  assigned_to: number | null;
  assigned_to_name?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  lead: number | null;
  lead_source?: string;
  deal_count?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}

export interface Deal {
  id: number;
  name: string;
  contact: number;
  contact_name?: string;
  assigned_to: number | null;
  assigned_to_name?: string;
  amount: string | null;
  stage: string;
  expected_close_date: string | null;
  probability: number;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}